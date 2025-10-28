import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { useDesignTracking } from "@/context/design-tracking-context";
import { useDesignTracker } from "@/hooks/use-design-tracker";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
  submitFeedbackService,
  getCourseFeedbacksService,
  updateOpennessActionsService,
  submitQuizService,
  logActionCulture,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import CultureQuizSection from "@/components/culture-quiz";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const { trackDesignFactor, trackMultipleInteractions } = useDesignTracking();
  const pageRef = useRef(null);
  const tracker = useDesignTracker();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [videoPlayed, setVideoPlayed] = useState(false);
  console.log({ videoPlayed });
  const [showQuizSection, setShowQuizSection] = useState(true);
  const [buyClicked, setBuyClicked] = useState(false);
  console.log({ buyClicked });
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizStartedAt, setQuizStartedAt] = useState(null);
  const timeLimitSeconds = 5 * 60; // 5 minutes
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [restraint, setRestraint] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  // const videoRef = useRef(null);

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

  const fetchFeedbacks = async () => {
    try {
      console.log({ userid: auth?.user?._id });
      const res = await getCourseFeedbacksService();
      setFeedbacks(res.data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  async function handleOpennessTracking() {
    console.log({ videoPlayed, buyClicked });
    if (buyClicked) {
      try {
        await updateOpennessActionsService(auth?.user?._id, {
          videoPlayed: true,
          buyClicked: true,
        });
        console.log("✅ Openness factor updated successfully");
      } catch (error) {
        console.error("❌ Error updating openness:", error);
      }
    }
  }

  // const handleOpennessTracking = async () => {
  //   try {
  //     const userId = auth?.user?._id;
  //     const data = {
  //       videoPlayed: true,
  //       buyClicked: true,
  //     };

  //     console.log("📡 Calling openness tracking API:", { userId, data });

  //     await updateOpennessActionsService(userId, data);
  //     console.log("✅ Openness tracking updated successfully");
  //   } catch (error) {
  //     console.error("❌ Error updating openness tracking:", error);
  //   }
  // };

  async function fetchStudentViewCourseDetails() {
    // Track page view
    trackDesignFactor("visualGraphics", 1, "course_details_view");

    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    // Track when user views free preview
    trackDesignFactor("entryPoint", 1, "free_preview_click");
    trackDesignFactor("activityNoticeability", 1, "video_preview_interaction");

    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    // Track when user clicks buy now
    trackDesignFactor("entryPoint", 2, "buy_now_click");
    trackDesignFactor("transitionNavigation", 1, "payment_flow_start");

    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  const handleVideoPlay = () => {
    console.log("🎬 Video started playing");
    setVideoPlayed(true);
  };

  // ✅ When user clicks the buy button
  const handleBuyClick = () => {
    console.log("🛒 Buy button clicked");
    setBuyClicked(true);
  };

  const handleGenerateNewQuiz = (result) => {
    if (result === "Passed") {
      setQuizQuestions(generateDummyQuestions());
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    try {
      setSubmitting(true);
      await submitFeedbackService({
        // courseId,
        userId: auth?.user?._id, // ✅ ensure userId available from auth context or props
        content: feedbackText,
      });
      setFeedbackText("");
      await fetchFeedbacks();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Track when dialog opens/closes
  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) {
      setShowFreePreviewDialog(true);
      trackDesignFactor("perceptiveAnimation", 1, "preview_dialog_open");
    }
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  // useEffect(() => {
  //   if (videoPlayed && buyClicked) {
  //     handleOpennessTracking();
  //   }
  // }, [videoPlayed, buyClicked]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
        failCount: resultData.failCount ?? 0,
      });
    } catch (err) {
      console.error("Quiz submit error:", err);
    } finally {
      setSubmittingQuiz(false);
    }
  }

  // Track image loads
  function handleImageLoad() {
    tracker.trackImageView();
  }

  const handleQuizSection = async (action) => {
    if (action === "skip") {
      setShowQuizSection(false);
      await logActionCulture({
        userId: auth?.user._id,
        actionType: "skipped_to_quiz",
      });
    } else if (action === "show") {
      setShowQuizSection(true);
    }
  };

  const handleRestraint = async () => {
      setRestraint(true);
      await logActionCulture({
        userId: auth?.user._id,
        actionType: "did_only_required",
      });
  };

  // Track scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      tracker.trackScroll();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tracker]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className=" mx-auto p-4" ref={pageRef}>
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li
                      key={index}
                      className="flex items-start"
                      onMouseEnter={() =>
                        trackDesignFactor("hierarchy", 1, "objective_hover")
                      }
                    >
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                    onMouseEnter={() =>
                      trackDesignFactor("gestalt", 1, "curriculum_item_hover")
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  // ref= {videoRef}
                  width="450px"
                  height="200px"
                  onPlay={() => {
                    trackDesignFactor("perceptiveAnimation", 1, "video_play");
                    setVideoPlayed(true); // 👈 new
                    handleOpennessTracking();
                    // handleVideoPlay();
                  }}
                  onPause={() =>
                    trackDesignFactor("perceptiveAnimation", 1, "video_pause")
                  }
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button
                onClick={() => {
                  // handleCreatePayment();
                  setBuyClicked(true);
                  handleOpennessTracking();
                  // handleBuyClick();
                }}
                className="w-full"
                onMouseEnter={() =>
                  trackDesignFactor("color", 1, "buy_button_hover")
                }
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mt-10 p-5 border-t border-gray-300">
        <h3 className="text-xl font-semibold mb-4">Course Feedback</h3>

        {/* Feedback Form */}
        <div className="mb-6">
          <Textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share your thoughts about this course..."
            className="w-full mb-3"
            rows={4}
          />
          <Button
            onClick={handleFeedbackSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">
              No feedback yet. Be the first to comment!
            </p>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-4 bg-gray-100 rounded-lg border border-gray-200"
              >
                <p className="text-gray-800">{fb.content}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>By: {fb.userId?.userName || "Anonymous"}</span>
                  <span
                    className={`font-medium ${
                      fb.sentiment === "positive"
                        ? "text-green-600"
                        : fb.sentiment === "negative"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {fb.sentiment}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Quiz Section */}
      <div className="flex p-5 gap-4 mb-3">
        <h2 className="text-lg font-bold mb-2">Quiz section: </h2>
        <button
          className={"px-3 py-1 rounded bg-red-500 text-white"}
          onClick={() => handleQuizSection("skip")}
        >
          Skip
        </button>
        <button
          className={"px-3 py-1 rounded bg-blue-500 text-white"}
          onClick={() => handleQuizSection("show")}
        >
          Show
        </button>
      </div>
      {showQuizSection && (
        <div className="mt-8 p-5 border-t border-gray-300">
          <h3 className="text-xl font-semibold mb-4">Quick Quiz</h3>

          {quizResult ? (
            <div className="mb-4">
              <p className="text-lg">
                Result:{" "}
                <span
                  className={
                    quizResult.passed ? "text-green-600" : "text-red-600"
                  }
                >
                  {quizResult.passed ? "Passed" : "Failed"}
                </span>
              </p>
              <p>Score: {quizResult.score} / 10</p>
              <p>Attempts: {quizResult.attempts}</p>
              <p>Fail counts: {quizResult.failCount}</p>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  // setQuizQuestions(generateDummyQuestions());
                  handleGenerateNewQuiz(
                    quizResult.passed ? "Passed" : "Failed"
                  );
                  setAnswers({});
                  setQuizStartedAt(Date.now());
                  setQuizResult(null);
                }}
              >
                Retry (new quiz)
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 text-sm text-gray-600">
                Finish within {Math.floor(timeLimitSeconds / 60)} minutes to
                improve conscientiousness.
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-white rounded shadow-sm">
                    <div className="font-medium mb-2">
                      {idx + 1}. {q.text}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => selectAnswer(idx, opt)}
                          className={`p-2 border rounded ${
                            answers[idx] === opt
                              ? "bg-blue-600 text-white"
                              : "bg-gray-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submittingQuiz}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {submittingQuiz ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {/* Culture Quiz Section */}
      {!restraint && (
        <div>
          <div className="flex gap-4 mb-3">
            <h2 className="p-3">You can skip all sections in below.</h2>{" "}
            <button
              className={"px-5 py-1 rounded bg-red-500 text-white"}
              onClick={handleRestraint}
            >
              Skip
            </button>
          </div>
          <CultureQuizSection userId={auth?.user?._id} />
        </div>
      )}

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={(open) => {
          setShowFreePreviewDialog(open);
          if (!open) {
            setDisplayCurrentVideoFreePreview(null);
            trackDesignFactor("perceptiveAnimation", 1, "preview_dialog_close");
          }
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
              onPlay={
                () => {
                  trackDesignFactor(
                    "perceptiveAnimation",
                    1,
                    "preview_video_play"
                  );
                } // 👈 call check
              }
              onPause={() =>
                trackDesignFactor(
                  "perceptiveAnimation",
                  1,
                  "preview_video_pause"
                )
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => {
                    handleSetFreePreview(filteredItem);
                  }}
                  className="cursor-pointer text-[16px] font-medium"
                  onMouseEnter={() =>
                    trackDesignFactor("gestalt", 1, "preview_list_hover")
                  }
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  trackDesignFactor("entryPoint", 1, "close_preview_click")
                }
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
