export const signUpFormControls = [
    {
        name: "userName",
        label: "User Name",
        placeholder: "Enter your user name",
        type: "text",
        componentType: "input",
    },
    {
        name: "userEmail",
        label: "User Email",
        placeholder: "Enter your user email",
        type: "email",
        componentType: "input",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        type: "password",
        componentType: "input",
    },
    {
        name: "university",
        label: "University",
        placeholder: "Enter your university, e.g GC University",
        type: "text",
        componentType: "input",
    },
    {
        name: "degree",
        label: "Degree",
        placeholder: "Enter degree, e.g BS Computer Sceince",
        type: "text",
        componentType: "input",
    },
    {
        name: "semester",
        label: "Semester",
        placeholder: "Enter semester, e.g 7th",
        type: "text",
        componentType: "input",
    },
];

export const signInFormControls = [
    {
        name: "userEmail",
        label: "User Email",
        placeholder: "Enter your user email",
        type: "email",
        componentType: "input",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        type: "password",
        componentType: "input",
    },
];

export const initialSignInFormData = {
    userEmail: "",
    password: "",
};

export const initialSignUpFormData = {
    userName: "",
    userEmail: "",
    password: "",
    university: "",
    degree: "",
    semester: "",
};

export const languageOptions = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "chinese", label: "Chinese" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "portuguese", label: "Portuguese" },
    { id: "arabic", label: "Arabic" },
    { id: "russian", label: "Russian" },
];

export const courseLevelOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
    { id: "artificial-intelligence", label: "Artificial Intelligence" },
    { id: "web-development", label: "Web Development -- under-construction" },
    {
        id: "backend-development",
        label: "Backend Development -- under-construction",
    },
    { id: "data-science", label: "Data Science -- under-construction" },
    { id: "machine-learning", label: "Machine Learning -- under-construction" },
    { id: "cloud-computing", label: "Cloud Computing -- under-construction" },
    { id: "cyber-security", label: "Cyber Security -- under-construction" },
    {
        id: "mobile-development",
        label: "Mobile Development -- under-construction",
    },
    { id: "game-development", label: "Game Development -- under-construction" },
    {
        id: "software-engineering",
        label: "Software Engineering -- under-construction",
    },
];

export const courseLandingPageFormControls = [
    {
        name: "title",
        label: "Title",
        componentType: "input",
        type: "text",
        placeholder: "Enter course title",
    },
    {
        name: "category",
        label: "Category",
        componentType: "select",
        type: "text",
        placeholder: "",
        options: courseCategories,
    },
    {
        name: "level",
        label: "Level",
        componentType: "select",
        type: "text",
        placeholder: "",
        options: courseLevelOptions,
    },
    {
        name: "primaryLanguage",
        label: "Primary Language",
        componentType: "select",
        type: "text",
        placeholder: "",
        options: languageOptions,
    },
    {
        name: "subtitle",
        label: "Subtitle",
        componentType: "input",
        type: "text",
        placeholder: "Enter course subtitle",
    },
    {
        name: "description",
        label: "Description",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course description",
    },
    {
        name: "pricing",
        label: "Pricing",
        componentType: "input",
        type: "number",
        placeholder: "Enter course pricing",
    },
    {
        name: "objectives",
        label: "Objectives",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course objectives",
    },
    {
        name: "welcomeMessage",
        label: "Welcome Message",
        componentType: "textarea",
        placeholder: "Welcome message for students",
    },
];

export const courseLandingInitialFormData = {
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    subtitle: "",
    description: "",
    pricing: "",
    objectives: "",
    welcomeMessage: "",
    image: "",
};

export const courseCurriculumInitialFormData = [
    {
        title: "",
        videoUrl: "",
        freePreview: false,
        public_id: "",
    },
];

export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
    category: courseCategories,
    level: courseLevelOptions,
    primaryLanguage: languageOptions,
};
