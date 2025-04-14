import { useCallback, useState } from "react";

type Theme = "light" | "dark" | "system";

function validateTheme(theme: string | null): Theme {
  return theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
}

export function ThemeSwitcherSafeHTML({
  children,
  lang,
  ...props
}: React.HTMLProps<HTMLHtmlElement> & { lang: string }) {
  if (typeof document === "undefined") {
    return (
      <html {...props} lang={lang}>
        {children}
      </html>
    );
  }

  const theme = localStorage.getItem("theme");
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const className = theme === "system" || !theme ? (isDarkMode ? "dark" : "light") : theme;

  return (
    <html {...props} lang={lang} className={className}>
      {children}
    </html>
  );
}

export function ThemeSwitcherScript({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: `(function(){function applyTheme(theme){document.documentElement.className=theme}var theme=localStorage.getItem("theme");var isDarkMode=window.matchMedia("(prefers-color-scheme: dark)").matches;var themeToApply=theme==="system"||!theme?(isDarkMode?"dark":"light"):theme;applyTheme(themeToApply);window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(event){var updatedTheme=event.matches?"dark":"light";if(!localStorage.getItem("theme")||localStorage.getItem("theme")==="system"){applyTheme(updatedTheme)}})})();`
      }}
    />
  );
}

export function getTheme() {
  const theme = typeof document === "undefined" ? "system" : localStorage.getItem("theme");
  return validateTheme(theme);
}

export function toggleTheme() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const currentTheme = getTheme();
  let newTheme = currentTheme === "light" ? "dark" : "light";

  if (currentTheme === "system") {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    newTheme = isDarkMode ? "light" : "dark";
  }

  localStorage.setItem("theme", newTheme);
  document.documentElement.className = newTheme;
}

export function setTheme(theme: Theme | string) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const validatedTheme = validateTheme(theme);
  const themeToSet =
    validatedTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : validatedTheme;

  if (theme !== "system") {
    localStorage.setItem("theme", validatedTheme);
  } else {
    localStorage.removeItem("theme");
  }

  document.documentElement.className = themeToSet;
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getTheme());

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  }, []);

  return [currentTheme, updateTheme];
}
