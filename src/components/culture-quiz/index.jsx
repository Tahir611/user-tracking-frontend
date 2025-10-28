import React, { useState, useEffect } from "react";
import {
  logActionCulture,
  logQuizStartCulture,
  logQuizSubmitCulture,
  submitQuizService,
} from "@/services";

const dummyQuestions = [
  {
    q: "Which planet is closest to the Sun?",
    a: ["Venus", "Mercury", "Earth"],
    correct: "Mercury",
  },
  {
    q: "What do you prefer when working on a project?",
    a: ["Work alone", "Work in a group", "Let others decide"],
    correct: "Work in a group",
  },
  {
    q: "When do you usually complete your tasks?",
    a: ["Early before deadline", "Just on time", "After the deadline"],
    correct: "Early before deadline",
  },
  {
    q: "How do you like to study?",
    a: ["Go through all lessons", "Only what is required", "Skip hard parts"],
    correct: "Go through all lessons",
  },
  {
    q: "If extra videos or readings are given, what do you do?",
    a: ["Watch/read them too", "Ignore them", "Ask others for summary"],
    correct: "Watch/read them too",
  },
  {
    q: "When you get new instructions, what do you do first?",
    a: [
      "Read carefully before starting",
      "Start without reading",
      "Ask someone to explain",
    ],
    correct: "Read carefully before starting",
  },
  {
    q: "If you fail a quiz once, what do you do?",
    a: ["Try again until I pass", "Leave it", "Complain about it"],
    correct: "Try again until I pass",
  },
  {
    q: "How do you deal with difficult topics?",
    a: ["Ask others for help", "Do my own research", "Skip and move on"],
    correct: "Do my own research",
  },
  {
    q: "You get an announcement from your teacher. What do you do?",
    a: ["Read it carefully", "Ignore it", "Wait for someone to explain"],
    correct: "Read it carefully",
  },
  {
    q: "After finishing a course, would you share your opinion?",
    a: ["Yes, give feedback", "No, just leave", "Only if asked"],
    correct: "Yes, give feedback",
  },
];

export default function CultureQuizSection({ userId }) {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [attemptType, setAttemptType] = useState();
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [showAttemptOptions, setShowAttemptOptions] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [showGeneralQuestions, setShowGeneralQuestions] = useState(false);
  console.log({ attemptType });
  const timeLimitSeconds = 60;

  useEffect(() => {
    // shuffle questions each refresh
    const shuffled = [...dummyQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuestions(shuffled);
    setStartTime(Date.now());
  }, []);

  const handleStart = async () => {
    await logQuizStartCulture({ userId, attemptType, quizId: "dummy-quiz" });
    setShowGeneralQuestions(true);
    setAttemptType(false);
  };

  const handleRestart = async () => {
    setSubmitted(false);
    setAttemptType();
  };

  const handleSubmit = async () => {
    const timeTakenSeconds = (Date.now() - startTime) / 1000;
    setSubmitted(true);

    // Quiz submit + culture track
    await submitQuizService({
      userId,
      quizId: "dummy-quiz",
      score,
      timeTakenSeconds,
      timeLimitSeconds,
    });
    await logQuizSubmitCulture({
      userId,
      quizId: "dummy-quiz",
      timeTakenSeconds,
      timeLimitSeconds,
    });
    await logActionCulture({
      userId,
      actionType: "explored_all_modules",
    });
  };

  const handleAnswer = (correct) => {
    if (correct) setScore((prev) => prev + 1);
  };

  const handleAnnounce = async (action) => {
    if (action === "skip") {
      setShowAnnounce(false);
      await logActionCulture({
        userId,
        actionType: "skipped_announcements",
      });
    } else if (action === "show") {
      await logActionCulture({
        userId,
        actionType: "opened_announcements",
      });
      await logActionCulture({
        userId,
        actionType: "explored_optional_content",
      });
      setShowAnnounce(true);
    } else if (action === "skip_attempt") {
      await logActionCulture({
        userId,
        actionType: "explored_optional_content",
      });
      setShowAttemptOptions(false);
    }
  };

  return (
    <div className="mt-8 p-4 rounded-lg shadow bg-white">
      <div className="flex gap-4 mb-3">
        <h2 className="text-lg font-bold mb-2">Announcement: </h2>
        <button
          className={"px-3 py-1 rounded bg-red-500 text-white"}
          onClick={() => handleAnnounce("skip")}
        >
          Skip
        </button>
        <button
          className={"px-3 py-1 rounded bg-blue-500 text-white"}
          onClick={() => handleAnnounce("show")}
        >
          Show
        </button>
      </div>

      {showAnnounce && (
        <p className="mb-5">
          An announcement is appearing in the Morning Post tomorrow
        </p>
      )}

      <h2 className="text-lg font-bold mb-2">General Section</h2>

      {showAttemptOptions && (
        <div className="flex gap-4 mb-3">
          <button
            className={`px-3 py-1 rounded ${
              attemptType === "solo" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAttemptType("solo")}
          >
            Solo Attempt
          </button>
          <button
            className={`px-3 py-1 rounded ${
              attemptType === "group" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAttemptType("group")}
          >
            Group Attempt
          </button>
          <button
            className={`px-3 py-1 rounded ${
              attemptType === "group" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleAnnounce("skip_attempt")}
          >
            Skip Attempt
          </button>
        </div>
      )}
      {!showAttemptOptions && (
        <button
          className={`px-3 py-1 rounded ${
            attemptType === "group" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowAttemptOptions(true)}
        >
          Show Attempt
        </button>
      )}

      {attemptType && (
        <button
          className="px-4 py-2 bg-green-500 text-white rounded mb-4"
          onClick={handleStart}
        >
          Start
        </button>
      )}

      {showGeneralQuestions && (
        <div>
          {!submitted &&
            questions.map((q, idx) => (
              <div key={idx} className="mb-3 border p-2 rounded">
                <p className="font-medium">
                  {idx + 1}. {q.q}
                </p>
                <div className="flex gap-2 mt-1">
                  {q.a.map((opt) => (
                    <button
                      key={opt}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                      onClick={() => handleAnswer(opt === q.correct)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <button
            disabled={submitted}
            className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {submitted && (
            <div>
              <p className="mt-3 font-semibold">
                Result: {score >= 6 ? "Pass 🎉" : "Fail ❌"} ({score}/10)
              </p>
              <button
                // disabled={submitted}
                className="px-4 py-2 bg-green-600 text-white rounded mt-4"
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
