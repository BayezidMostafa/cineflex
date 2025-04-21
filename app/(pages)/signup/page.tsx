import SignUpModal from "@/components/Auth/SignUp/SignUpModal";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <div className="text-center pt-8">
        <h1 className="text-4xl font-bold tracking-tight">Cineflex</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          Discover your next favorite film with personalized recommendations and
          curated collections.
        </p>
      </div>
      <div className="border-2 rounded-lg border-gray-600 p-4 mt-8 w-full max-w-md">
        <SignUpModal />
      </div>
    </div>
  );
};

export default SignUpPage;
