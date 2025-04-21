"use client";

import Link from "next/link";

const SignUpLink = () => {
  return (
    <p className="text-gray-400">
      Don&apos;t have an account?{" "}
      <Link
        href="/signup"
        className="font-medium text-white hover:text-gray-200"
      >
        Sign up
      </Link>
    </p>
  );
};

export default SignUpLink;
