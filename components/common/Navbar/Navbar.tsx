import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavData } from "@/lib/data";
import Link from "next/link";
import React, { useState } from "react";
import { X, Menu, Loader } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useModalStore } from "@/store/useModalStore";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isLoaded, userId, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const { openModal } = useModalStore();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <nav className="flex items-center justify-between fixed left-0 right-0 max-w-7xl mx-auto p-5 bg-background rounded-b-lg shadow border-2 border-primary-foreground z-50">
      <Link href="/">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          Cineflex
        </h2>
      </Link>
      <div className="hidden md:flex gap-6 md:gap-8 lg:gap-10 font-medium">
        {NavData.map((n, i) => (
          <Link href={n?.href} key={i}>
            <span
              className={`${
                pathname === n?.href
                  ? "text-primary font-semibold border-b-2 border-primary" // Active style
                  : "text-primary/80"
              }`}
            >
              {n?.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {isLoaded ? (
          <div>
            {userId ? (
              <Button disabled={loading} onClick={handleLogout}>
                Logout {loading && <Loader className="animate-spin" />}
              </Button>
            ) : (
              <>
                <Button onClick={() => openModal("LOGIN_MODAL")}>Login</Button>
              </>
            )}
          </div>
        ) : (
          <>
            <Loader className="animate-spin" />
          </>
        )}
        <ThemeToggle />
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-full bg-background p-5 shadow-lg z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Cineflex</h2>
          <button onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col items-center gap-4 font-medium">
          {NavData.map((n, i) => (
            <Link href={n?.href} key={i} onClick={toggleSidebar}>
              <span
                className={`${
                  pathname === n?.href
                    ? "text-primary font-semibold border-b-2 border-primary" // Active style
                    : "text-primary/80"
                }`}
              >
                {n?.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </nav>
  );
};

export default Navbar;
