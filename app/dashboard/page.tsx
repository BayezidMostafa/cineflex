'use client'

// app/dashboard/page.tsx
import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = useAuth();

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting to sign-in...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome to your Dashboard!</h2>
      <p>This is your secure dashboard area.</p>
    </div>
  );
}
