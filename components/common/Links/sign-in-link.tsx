"use client";

import Link from "next/link";

const SignInLink = () => {
  return (
    <p className="text-gray-400">
      Already have an account?{" "}
      <Link
        href="/login"
        className="font-medium text-white hover:text-gray-200"
      >
        Login
      </Link>
    </p>
  );
};

export default SignInLink;
