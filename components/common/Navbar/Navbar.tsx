import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavData } from "@/lib/data";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between fixed left-0 right-0 max-w-7xl mx-auto p-5 bg-background rounded-b-lg shadow z-50">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
        Cineflex
      </h2>
      <div className="flex gap-6 md:gap-8 lg:gap-10 font-medium">
        {NavData.map((n, i) => (
          <Link href={n?.href} key={i}>
            {n?.label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
