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
import { courseObjectiveDetails } from "./courseContentDetails";

function StudentViewCourseDetailsPage() {
    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);

    const courseObjectives = [
        "Intro of Artificial Intellience",
        "Use of Artificial Intellience",
        "The AI Revolution",
        "Computing power",
    ];

    const { auth } = useContext(AuthContext);
    const { trackDesignFactor, trackMultipleInteractions } =
        useDesignTracking();
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

    // function generateDummyQuestions() {
    //   const q = [];
    //   for (let i = 0; i < 10; i++) {
    //     const a = Math.floor(Math.random() * 10) + 1;
    //     const b = Math.floor(Math.random() * 10) + 1;
    //     const correct = a + b;
    //     const options = [correct, correct + 1, correct - 1, correct + 2].sort(
    //       () => Math.random() - 0.5
    //     );
    //     q.push({
    //       id: `q-${Date.now()}-${i}`,
    //       text: `What is ${a} + ${b}?`,
    //       options,
    //       correctAnswer: correct,
    //     });
    //   }
    //   return q;
    // }

    //   function generateDummyQuestions() {
    //   const aiQuestions = [
    //     {
    //       text: "Which of the following best describes the bias-variance tradeoff in machine learning?",
    //       options: [
    //         "Balancing model simplicity and performance on unseen data",
    //         "Optimizing dataset size for better accuracy",
    //         "Adjusting neural network layers to reduce overfitting",
    //         "Reducing the training time without losing accuracy",
    //       ],
    //       correctAnswer: "Balancing model simplicity and performance on unseen data",
    //     },
    //     {
    //       text: "What is the main purpose of backpropagation in neural networks?",
    //       options: [
    //         "To update the model weights using error gradients",
    //         "To initialize model parameters",
    //         "To prevent overfitting through regularization",
    //         "To split data into training and testing sets",
    //       ],
    //       correctAnswer: "To update the model weights using error gradients",
    //     },
    //     {
    //       text: "In NLP, what does the term 'embedding' refer to?",
    //       options: [
    //         "Representing words as dense numerical vectors",
    //         "Compressing datasets to smaller sizes",
    //         "Mapping documents into word frequency counts",
    //         "Building a hierarchical structure for language parsing",
    //       ],
    //       correctAnswer: "Representing words as dense numerical vectors",
    //     },
    //     {
    //       text: "Which of the following activation functions can help mitigate the vanishing gradient problem?",
    //       options: ["ReLU", "Sigmoid", "Tanh", "Softmax"],
    //       correctAnswer: "ReLU",
    //     },
    //     {
    //       text: "What is the key difference between supervised and unsupervised learning?",
    //       options: [
    //         "Labeled vs unlabeled training data",
    //         "Structured vs unstructured datasets",
    //         "Online vs offline model training",
    //         "Batch vs stochastic optimization",
    //       ],
    //       correctAnswer: "Labeled vs unlabeled training data",
    //     },
    //     {
    //       text: "Which of the following evaluation metrics is most appropriate for imbalanced classification problems?",
    //       options: ["F1 Score", "Accuracy", "Mean Squared Error", "R-squared"],
    //       correctAnswer: "F1 Score",
    //     },
    //     {
    //       text: "What is the main advantage of using convolutional layers in image processing?",
    //       options: [
    //         "They capture spatial hierarchies and local features",
    //         "They require no training data",
    //         "They reduce overfitting completely",
    //         "They only work on grayscale images",
    //       ],
    //       correctAnswer: "They capture spatial hierarchies and local features",
    //     },
    //     {
    //       text: "What does the term 'regularization' mean in machine learning?",
    //       options: [
    //         "Adding a penalty to reduce model complexity and overfitting",
    //         "Increasing model depth to improve accuracy",
    //         "Scaling feature values for better convergence",
    //         "Augmenting data to improve training performance",
    //       ],
    //       correctAnswer: "Adding a penalty to reduce model complexity and overfitting",
    //     },
    //     {
    //       text: "In reinforcement learning, what is the role of the 'reward function'?",
    //       options: [
    //         "It guides the agent by providing feedback on actions",
    //         "It defines the environment's state space",
    //         "It stores previous training experiences",
    //         "It adjusts the learning rate dynamically",
    //       ],
    //       correctAnswer: "It guides the agent by providing feedback on actions",
    //     },
    //     {
    //       text: "What does 'transfer learning' allow in deep learning models?",
    //       options: [
    //         "Using pre-trained knowledge for a new related task",
    //         "Increasing training speed using multiple GPUs",
    //         "Transferring model weights between layers",
    //         "Improving interpretability of black-box models",
    //       ],
    //       correctAnswer: "Using pre-trained knowledge for a new related task",
    //     },
    //     {
    //       text: "Which optimization algorithm adapts learning rates for each parameter?",
    //       options: ["Adam", "Gradient Descent", "RMSProp", "Momentum"],
    //       correctAnswer: "Adam",
    //     },
    //     {
    //       text: "In clustering, what does the K in K-Means stand for?",
    //       options: [
    //         "The number of clusters to form",
    //         "Kernel parameter for distance metric",
    //         "Kurtosis of the dataset",
    //         "Key iteration threshold",
    //       ],
    //       correctAnswer: "The number of clusters to form",
    //     },
    //   ];

    //   // Shuffle and pick 10 random questions
    //   const shuffled = aiQuestions
    //     .map((q) => ({
    //       ...q,
    //       options: q.options.sort(() => Math.random() - 0.5),
    //     }))
    //     .sort(() => Math.random() - 0.5)
    //     .slice(0, 10);

    //   // Add IDs for compatibility
    //   return shuffled.map((q, i) => ({
    //     id: `q-${Date.now()}-${i}`,
    //     ...q,
    //   }));
    // }

    function generateDummyQuestions() {
        const aiQuestions = [
            {
                text: "What does AI stand for?",
                options: [
                    "Artificial Intelligence",
                    "Automated Integration",
                    "Active Internet",
                    "Advanced Interface",
                ],
                correctAnswer: "Artificial Intelligence",
            },
            {
                text: "Which of the following is a type of machine learning?",
                options: [
                    "Supervised Learning",
                    "Network Routing",
                    "Data Encryption",
                    "Cloud Hosting",
                ],
                correctAnswer: "Supervised Learning",
            },
            {
                text: "Which company developed ChatGPT?",
                options: ["OpenAI", "Google", "Microsoft", "Amazon"],
                correctAnswer: "OpenAI",
            },
            {
                text: "What is the primary goal of Natural Language Processing (NLP)?",
                options: [
                    "Understanding human language",
                    "Creating images",
                    "Encrypting data",
                    "Analyzing hardware performance",
                ],
                correctAnswer: "Understanding human language",
            },
            {
                text: "Which algorithm is commonly used for classification problems?",
                options: [
                    "Decision Trees",
                    "Genetic Algorithms",
                    "PageRank",
                    "RSA",
                ],
                correctAnswer: "Decision Trees",
            },
            {
                text: "What is a neural network inspired by?",
                options: [
                    "Human brain",
                    "CPU architecture",
                    "Internet protocols",
                    "Solar systems",
                ],
                correctAnswer: "Human brain",
            },
            {
                text: "Which language is widely used for AI development?",
                options: ["Python", "HTML", "CSS", "PHP"],
                correctAnswer: "Python",
            },
            {
                text: "What is overfitting in machine learning?",
                options: [
                    "Model performs well on training data but poorly on new data",
                    "Model performs poorly on training data",
                    "Model cannot make predictions",
                    "Model runs out of memory",
                ],
                correctAnswer:
                    "Model performs well on training data but poorly on new data",
            },
            {
                text: "Which of these is an example of reinforcement learning?",
                options: [
                    "Training an AI to play chess",
                    "Predicting house prices",
                    "Recognizing faces in photos",
                    "Sorting emails into folders",
                ],
                correctAnswer: "Training an AI to play chess",
            },
            {
                text: "Which term describes a system that can perform tasks without human intervention?",
                options: [
                    "Automation",
                    "Debugging",
                    "Compilation",
                    "Scheduling",
                ],
                correctAnswer: "Automation",
            },
        ];

        // shuffle questions and assign IDs like before
        // const shuffled = aiQuestions
        //     .sort(() => Math.random() - 0.5)
        //     .slice(0, 10);

        const shuffled = aiQuestions
            .map((q) => ({
                ...q,
                options: q.options.sort(() => Math.random() - 0.5),
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return shuffled.map((q, i) => ({
            id: `q-${Date.now()}-${i}`,
            ...q,
        }));
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
        trackDesignFactor(
            "activityNoticeability",
            1,
            "video_preview_interaction"
        );

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

    function openSurveyForm(user) {
        const baseUrl =
            "https://docs.google.com/forms/d/e/1FAIpQLScDDIVHY_8RDhsIWr3llG_mpWeHI-_GPYzf_8cHKLJT-LGcXA/viewform?usp=pp_url";

        const url =
            `${baseUrl}` +
            `&entry.212554375=${encodeURIComponent(user.userName)}` +
            `&entry.1862598258=${encodeURIComponent(user.university)}` +
            `&entry.1753595445=${encodeURIComponent(user.degree)}` +
            `&entry.1679820537=${encodeURIComponent(user.semester)}`;

        window.open(url, "_blank");
    }

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
            console.log({ q, idx });
            const selected = answers[idx];
            console.log({ selected });
            if (selected === q.correctAnswer) score++;
        });

        const timeTakenSeconds = Math.floor(
            (Date.now() - quizStartedAt) / 1000
        );

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
                <p className="text-xl mb-4">
                    {studentViewCourseDetails?.subtitle}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>
                        Created By {studentViewCourseDetails?.instructorName}
                    </span>
                    <span>
                        Created On{" "}
                        {studentViewCourseDetails?.date.split("T")[0]}
                    </span>
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
                                {courseObjectives
                                    // .split(",")
                                    .map((objective, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start cursor-pointer"
                                            onClick={() => {
                                                // document
                                                //     .getElementById(
                                                //         `objective-${index}`
                                                //     )
                                                //     ?.scrollIntoView({
                                                //         behavior: "smooth",
                                                //     });
                                                const element =
                                                    document.getElementById(
                                                        `objective-${index}`
                                                    );
                                                const yOffset = -80;
                                                const y =
                                                    element.getBoundingClientRect()
                                                        .top +
                                                    window.pageYOffset +
                                                    yOffset;
                                                window.scrollTo({
                                                    top: y,
                                                    behavior: "smooth",
                                                });
                                            }}
                                            onMouseEnter={() =>
                                                trackDesignFactor(
                                                    "hierarchy",
                                                    1,
                                                    "objective_hover"
                                                )
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
                        <CardContent>
                            {studentViewCourseDetails?.description}
                        </CardContent>
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
                                                ? () =>
                                                      handleSetFreePreview(
                                                          curriculumItem
                                                      )
                                                : null
                                        }
                                        onMouseEnter={() =>
                                            trackDesignFactor(
                                                "gestalt",
                                                1,
                                                "curriculum_item_hover"
                                            )
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
                                            ? studentViewCourseDetails
                                                  ?.curriculum[
                                                  getIndexOfFreePreviewUrl
                                              ].videoUrl
                                            : ""
                                    }
                                    // ref= {videoRef}
                                    width="450px"
                                    height="200px"
                                    onPlay={() => {
                                        trackDesignFactor(
                                            "perceptiveAnimation",
                                            1,
                                            "video_play"
                                        );
                                        setVideoPlayed(true); // 👈 new
                                        handleOpennessTracking();
                                        // handleVideoPlay();
                                    }}
                                    onPause={() =>
                                        trackDesignFactor(
                                            "perceptiveAnimation",
                                            1,
                                            "video_pause"
                                        )
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
                                    trackDesignFactor(
                                        "color",
                                        1,
                                        "buy_button_hover"
                                    )
                                }
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <div className="space-y-10 mt-20 pr-96 pl-14">
                {courseObjectiveDetails.map((item, index) => (
                    <section key={index} id={`objective-${index}`}>
                        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {item.content}
                        </p>
                    </section>
                ))}
            </div>
            <div className="mt-14 ml-14">
                <Button
                    className="w-1/2"
                    onClick={() => openSurveyForm(auth?.user)}
                >
                    Fill Survey
                </Button>
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
                                    <span>
                                        By: {fb.userId?.userName || "Anonymous"}
                                    </span>
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
                                        quizResult.passed
                                            ? "text-green-600"
                                            : "text-red-600"
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
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 text-sm text-gray-600">
                                Finish within{" "}
                                {Math.floor(timeLimitSeconds / 60)} minutes to
                                improve conscientiousness.
                            </div>

                            <div className="space-y-4">
                                {quizQuestions.map((q, idx) => (
                                    <div
                                        key={q.id}
                                        className="p-3 bg-white rounded shadow-sm"
                                    >
                                        <div className="font-medium mb-2">
                                            {idx + 1}. {q.text}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        console.log({
                                                            idx,
                                                            opt,
                                                        });
                                                        selectAnswer(idx, opt);
                                                    }}
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
                                    {submittingQuiz
                                        ? "Submitting..."
                                        : "Submit Quiz"}
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
                        <h2 className="p-3">
                            You can skip all sections in below.
                        </h2>{" "}
                        <button
                            className={
                                "px-5 py-1 rounded bg-red-500 text-white"
                            }
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
                        trackDesignFactor(
                            "perceptiveAnimation",
                            1,
                            "preview_dialog_close"
                        );
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
                                        trackDesignFactor(
                                            "gestalt",
                                            1,
                                            "preview_list_hover"
                                        )
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
                                    trackDesignFactor(
                                        "entryPoint",
                                        1,
                                        "close_preview_click"
                                    )
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
