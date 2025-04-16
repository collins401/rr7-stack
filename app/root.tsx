import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams
} from "react-router";
import { Toaster } from "@/components/sonner";
import type { Route } from "./+types/root";
import { ProgressBar } from "./components/progress-bar";
import { ThemeSwitcherSafeHTML, ThemeSwitcherScript } from "./components/theme-switcher";
import { useNonce } from "./hooks/use-nonce";
import { getLang } from "./lib/index";
import style from "./app.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: style, type: "text/css" },
  { rel: "icon", href: "/favicon.svg", type: "image/x-icon" }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lang = getLang(params);
  const nonce = useNonce();
  return (
    <ThemeSwitcherSafeHTML lang={lang} className="touch-manipulation overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeSwitcherScript nonce={nonce} />
      </head>
      <body>
        <ProgressBar />
        {children}
        <Toaster richColors position="top-right" />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </ThemeSwitcherSafeHTML>
  );
}
export function HydrateFallback() {
  return <p>Loading </p>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
