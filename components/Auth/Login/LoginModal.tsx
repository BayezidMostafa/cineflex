"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignIn } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { ClerkAPIError } from "@clerk/types";
import { usePathname } from "next/navigation";
import SignUpLink from "@/components/common/Links/sign-up-link";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginModal: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { openModal, closeModal } = useModalStore();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = React.useState<ClerkAPIError[]>();
  const pathname = usePathname();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        closeModal();
        toast.success("Login successful!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setError(err.errors);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-3 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Login</h2>
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
            <span className="text-red-500 text-sm">{errors.email.message}</span>
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
        {error && (
          <span className="text-red-500 text-sm">{error[0]?.message}</span>
        )}

        <p
          className="cursor-pointer"
          onClick={() => openModal("FORGOT_PASSWORD_MODAL")}
        >
          Forgot Password?
        </p>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          Login {isLoading && <Loader className="animate-spin" />}
        </Button>
        {pathname === "/login" ? (
          <>
            <SignUpLink />
          </>
        ) : (
          <>
            <p>
              Don&apos;t have an account?{" "}
              <span
                className="underline underline-offset-2 cursor-pointer"
                onClick={() => openModal("SIGN_UP_MODAL")}
              >
                Signup
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginModal;
