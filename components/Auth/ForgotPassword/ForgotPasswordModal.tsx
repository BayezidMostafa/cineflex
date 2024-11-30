"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";

interface ForgotPasswordInputs {
  email: string;
}

interface ResetPasswordInputs {
  password: string;
  code: string;
}

const ForgotPasswordModal = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { closeModal } = useModalStore();

  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
  } = useForm<ForgotPasswordInputs>();

  const {
    register: registerResetPassword,
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
  } = useForm<ResetPasswordInputs>();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    router.push("/");
  }

  // Send the password reset code to the user's email
  const handleForgotPassword: SubmitHandler<ForgotPasswordInputs> = async (
    data
  ) => {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("Error:", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  // Reset the user's password
  const handleResetPassword: SubmitHandler<ResetPasswordInputs> = async (
    data
  ) => {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
        }
      })
      .catch((err) => {
        console.error("Error:", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  return (
    <div className="p-3 md:p-6 max-w-md">
      <h5 className="text-xl md:text-2xl text-center">Forgot Password?</h5>
      <h6 className="mb-3">A verification code will be sent to your email.</h6>
      {!successfulCreation ? (
        <form
          onSubmit={handleForgotPasswordSubmit(handleForgotPassword)}
          className="flex flex-col gap-2"
        >
          {/* Email Field */}
          <label htmlFor="email">Provide your email address</label>
          <input
            type="email"
            placeholder="e.g john@doe.com"
            {...registerForgotPassword("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            className="outline-none p-2 rounded-md border-2 border-primary"
          />
          {forgotPasswordErrors.email && (
            <p className="text-red-500">{forgotPasswordErrors.email.message}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full" type="submit">Send password reset code</Button>
            <Button className="w-full" type="button" onClick={() => closeModal()}>
              Cancel
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <form
          onSubmit={handleResetPasswordSubmit(handleResetPassword)}
          className="flex flex-col gap-2"
        >
          {/* New Password Field */}
          <label htmlFor="password">Enter your new password</label>
          <input
            type="password"
            placeholder="New password"
            {...registerResetPassword("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="outline-none p-2 rounded-md border-2 border-primary"
          />
          {resetPasswordErrors.password && (
            <p className="text-red-500">
              {resetPasswordErrors.password.message}
            </p>
          )}

          {/* Reset Code Field */}
          <label htmlFor="code">Enter the password reset code</label>
          <input
            type="text"
            placeholder="Reset code"
            {...registerResetPassword("code", {
              required: "Reset code is required",
            })}
            className="outline-none p-2 rounded-md border-2 border-primary"
          />
          {resetPasswordErrors.code && (
            <p className="text-red-500">{resetPasswordErrors.code.message}</p>
          )}

          <Button type="submit">Reset</Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}

      {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
    </div>
  );
};

export default ForgotPasswordModal;
