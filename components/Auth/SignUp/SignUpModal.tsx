"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useSignUp } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader } from "lucide-react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { ClerkAPIError } from "@clerk/types";
import { Input } from "@/components/ui/input";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpModal: React.FC = () => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const { openModal, closeModal } = useModalStore();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<ClerkAPIError[]>();
  const [verificationCode, setVerificationCode] = useState("");
  const [type, setType] = useState("password");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormInputs>();

  const password = watch("password");

  // Step 1: Sign Up Process
  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    if (!isLoaded) return;
    setLoading(true);
    setError([]);
    try {
      await signUp?.create({
        emailAddress: data?.email,
        password: data?.password,
      });

      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (isClerkAPIResponseError(err)) setError(err.errors);
      console.error(JSON.stringify(err, null, 2));
      toast.error("Failed to sign up. Please try again.");
    }
  };

  // Step 2: Verify Email Code
  const onVerify = async () => {
    if (!isLoaded || !signUp) return;
    setError([]);
    try {
      const completedSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completedSignUp?.status === "complete") {
        await setActive({ session: completedSignUp.createdSessionId });
        toast.success("Account created successfully!");
        setPendingVerification(false);
        closeModal();
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setError(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleOTPChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length <= 6) {
      setVerificationCode(sanitizedValue);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-3 sm:p-6">
      {pendingVerification ? (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
            Verify Your Email
          </h2>
          <div className="space-y-4">
            {/* OTP Input */}
            <div>
              <label className="font-medium">Enter OTP</label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => handleOTPChange(e.target.value)}
                maxLength={6}
                placeholder="Enter the 6-digit code"
                className="w-full px-4 py-2 text-center text-lg font-bold border border-gray-300 rounded-lg outline-none focus:border-primary"
              />
            </div>
            {error && (
              <span className="text-red-500 text-sm">
                {error[0]?.longMessage}
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" className="w-full" onClick={onVerify}>
                Verify {loading && <Loader className="animate-spin" />}
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => setPendingVerification(false)}
              >
                Go Back
              </Button>
            </div>
          </div>
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
                autoComplete="off"
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
              <div className="relative">
                <input
                  type={type}
                  autoComplete="off"
                  className={`w-full ps-4 pe-10 py-2 border ${
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
                <span className="absolute right-2 top-2 cursor-pointer">
                  {type === "password" ? (
                    <EyeOff className="" onClick={() => setType("text")} />
                  ) : (
                    <Eye className="" onClick={() => setType("password")} />
                  )}
                </span>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={type}
                  autoComplete="off"
                  className={`w-full ps-4 pe-10 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg outline-none`}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <span className="absolute right-2 top-2 cursor-pointer">
                  {type === "password" ? (
                    <EyeOff className="" onClick={() => setType("text")} />
                  ) : (
                    <Eye className="" onClick={() => setType("password")} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            {error && (
              <span className="text-red-500 text-sm">{error[0]?.message}</span>
            )}

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
