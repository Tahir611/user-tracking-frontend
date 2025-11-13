import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });
    const [loading, setLoading] = useState(true);

    async function handleRegisterUser(event) {
        event.preventDefault();
        setError("");
        const data = await registerService(signUpFormData);
        if (!data.success) {
            setError(data.message);
            return;
        }

        // ✅ Signup successful → redirect to sign-in
        alert("Signup successful! Please login.");

        setTimeout(() => {
            navigate("/auth?tab=signin");
        }, 800);
    }

    async function handleLoginUser(event) {
        event.preventDefault();
        setError("");
        const data = await loginService(signInFormData);
        console.log(data, "data");

        if (data.success) {
            sessionStorage.setItem(
                "accessToken",
                JSON.stringify(data.data.accessToken)
            );
            setAuth({
                authenticate: true,
                user: data.data.user,
            });
        } else {
            setAuth({
                authenticate: false,
                user: null,
            });
            setError(data.message);
            return;
        }
    }

    //check auth user

    async function checkAuthUser() {
        try {
            const data = await checkAuthService();
            if (data.success) {
                // const profile = await getProfileService();
              // console.log({profile});
              console.log({authUserData: data?.data?.user});
                setAuth({
                    authenticate: true,
                    user: {
                        ...data.data.user,
                        // ...profile.data, // merge backend profile fields
                    },
                });
                setLoading(false);
            } else {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null,
        });
    }

    function handleLogoutUser() {
        sessionStorage.removeItem("accessToken");
        resetCredentials();
    }

    useEffect(() => {
        checkAuthUser();
    }, []);

    console.log(auth, "gf");

    return (
        <AuthContext.Provider
            value={{
                signInFormData,
                setSignInFormData,
                signUpFormData,
                setSignUpFormData,
                handleRegisterUser,
                handleLoginUser,
                handleLogoutUser,
                auth,
                resetCredentials,
                error,
                setError,
            }}
        >
            {loading ? <Skeleton /> : children}
        </AuthContext.Provider>
    );
}
