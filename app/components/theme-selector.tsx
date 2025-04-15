import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "./ui/button";
import { useTheme } from "./theme-switcher";

export function ThemeSelector({
  children,
  align = "end"
}: {
  align?: any;
  children?: React.ReactNode;
}) {
  const [theme, setTheme] = useTheme();
  const hydrated = useHydrated();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="icon"
            variant="ghost"
            title="Theme selector"
            className="size-8 rounded-full ring-0 focus-visible:ring-opacity-0"
          >
            <span className="sr-only">Theme selector</span>

            {!hydrated ? null : theme === "dark" ? (
              <MoonIcon />
            ) : theme === "light" ? (
              <SunIcon />
            ) : (
              <LaptopIcon />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("light")}
            aria-selected={theme === "light"}
          >
            Light
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("dark")}
            aria-selected={theme === "dark"}
          >
            Dark
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("system")}
            aria-selected={theme === "system"}
          >
            System
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
