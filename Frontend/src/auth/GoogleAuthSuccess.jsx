import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const rawUser = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google authentication was cancelled or failed.");
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token);

        if (rawUser) {
          const userObj = JSON.parse(decodeURIComponent(rawUser));
          localStorage.setItem("nestesyLoggedInUser", JSON.stringify(userObj));
          localStorage.setItem("nestesyUser", JSON.stringify(userObj));
        }

        window.dispatchEvent(new CustomEvent("authStateChanged"));
        toast.success("Welcome back! Signed in with Google 🎉");

        navigate("/user/dashboard", { replace: true });
      } catch (err) {
        console.error("Error processing Google login data:", err);
        toast.error("Failed to complete Google login.");
        navigate("/login", { replace: true });
      }
    } else {
      toast.error("No authentication token received.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center max-w-sm w-full">
        <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Signing in with Google...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
