"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle(props: React.ComponentProps<typeof Button>) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      {...props}
    >
      <Sun className="rotate-0 scale-0 transition-all dark:rotate-90 dark:scale-100" />
      <Moon className="absolute rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
