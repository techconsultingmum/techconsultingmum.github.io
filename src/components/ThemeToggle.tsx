import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="rounded-full"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Sun className="w-5 h-5" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="w-4 h-4 mr-2" /> Light
          {theme === "light" && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="w-4 h-4 mr-2" /> Dark
          {theme === "dark" && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <Monitor className="w-4 h-4 mr-2" /> System
          {theme === "system" && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;