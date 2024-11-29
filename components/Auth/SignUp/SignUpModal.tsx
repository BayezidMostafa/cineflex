"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useSignUp } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerifyCodeInputs {
  code: string;
}

const SignUpModal: React.FC = () => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const { openModal } = useModalStore();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormInputs>();

  const {
    register: verifyRegister,
    handleSubmit: verifyHandleSubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyCodeInputs>();

  const password = watch("password"); // Watch the password field for validation

  // Step 1: Sign Up Process
  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp?.create({
        emailAddress: data?.email,
        password: data?.password,
      });

      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      setLoading(false);
      console.error("Sign-up Error:", error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  // Step 2: Verify Email Code
  const onVerify: SubmitHandler<VerifyCodeInputs> = async (data) => {
    if (!isLoaded || !signUp) return; // Ensure signUp and setActive are defined
    try {
      const completedSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completedSignUp?.status === "complete") {
        await setActive({ session: completedSignUp.createdSessionId });
        toast.success("Account created successfully!");
        setPendingVerification(false);
        openModal("LOGIN_MODAL");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error("Failed to verify. Please try again.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-3 sm:p-6">
      {pendingVerification ? (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
            Verify Your Email
          </h2>
          <form onSubmit={verifyHandleSubmit(onVerify)} className="space-y-4">
            {/* Verification Code Field */}
            <div>
              <label className="font-medium">Verification Code</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border ${
                  verifyErrors.code ? "border-red-500" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Enter verification code"
                {...verifyRegister("code", {
                  required: "Verification code is required",
                })}
              />
              {verifyErrors.code && (
                <span className="text-red-500 text-sm">
                  {verifyErrors.code.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="font-medium">Confirm Password</label>
              <input
                type="password"
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg outline-none`}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              Sign Up {loading && <Loader className="animate-spin" />}
            </Button>
            <p>
              Already have an account?{" "}
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() => openModal("LOGIN_MODAL")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUpModal;
