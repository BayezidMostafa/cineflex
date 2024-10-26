import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavData } from "@/lib/data";
import Link from "next/link";
import React, { useState } from "react";
import { X, Menu } from "lucide-react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <nav className="flex items-center justify-between fixed left-0 right-0 max-w-7xl mx-auto p-5 bg-background rounded-b-lg shadow z-50">
      <Link href="/">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          Cineflex
        </h2>
      </Link>
      <div className="hidden md:flex gap-6 md:gap-8 lg:gap-10 font-medium">
        {NavData.map((n, i) => (
          <Link href={n?.href} key={i}>
            {n?.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
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
        <nav className="flex flex-col items-center gap-4 font-medium ">
          {NavData.map((n, i) => (
            <Link href={n?.href} key={i} onClick={toggleSidebar}>
              {n?.label}
            </Link>
          ))}
        </nav>
      </aside>
    </nav>
  );
};

export default Navbar;
