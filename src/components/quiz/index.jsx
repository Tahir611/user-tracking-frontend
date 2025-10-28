// imports
import { submitQuizService } from "@/services";
import { useState, useEffect } from "react";

// inside your component
const [quizQuestions, setQuizQuestions] = useState([]);
const [answers, setAnswers] = useState({});
const [quizStartedAt, setQuizStartedAt] = useState(null);
const timeLimitSeconds = 5 * 60; // 5 minutes
const [quizResult, setQuizResult] = useState(null);
const [submittingQuiz, setSubmittingQuiz] = useState(false);

function generateDummyQuestions() {
  const q = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = a + b;
    const options = [correct, correct + 1, correct - 1, correct + 2].sort(
      () => Math.random() - 0.5
    );
    q.push({
      id: `q-${Date.now()}-${i}`,
      text: `What is ${a} + ${b}?`,
      options,
      correctAnswer: correct,
    });
  }
  return q;
}

useEffect(() => {
  setQuizQuestions(generateDummyQuestions());
  setAnswers({});
  setQuizStartedAt(Date.now());
  setQuizResult(null);
}, []);

function selectAnswer(qIndex, opt) {
  setAnswers((prev) => ({ ...prev, [qIndex]: opt }));
}

async function handleSubmitQuiz() {
  let score = 0;
  quizQuestions.forEach((q, idx) => {
    const selected = answers[idx];
    if (Number(selected) === Number(q.correctAnswer)) score++;
  });

  const timeTakenSeconds = Math.floor((Date.now() - quizStartedAt) / 1000);

  const payload = {
    userId: auth?.user?._id,
    quizId: quizQuestions[0]?.id?.split("-")[1],
    score,
    timeTakenSeconds,
    timeLimitSeconds,
  };

  try {
    setSubmittingQuiz(true);
    const res = await submitQuizService(payload);
    const resultData = res.data?.data || {};
    setQuizResult({
      passed: resultData.passed ?? score >= 6,
      score,
      attempts: resultData.attempts ?? 0,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
  } finally {
    setSubmittingQuiz(false);
  }
}
