import { Link, Outlet } from "react-router";
import { UserRound } from "lucide-react";
import { Github } from "@/components/icons";
import { ThemeSelector } from "@/components/theme-selector";
import { UserNav } from "@/components/user-nav";
import { getSession } from "@/lib/session";
import { Route } from "./+types/_layout";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const username = session.get("username");
  const avatar = session.get("avatar");
  const email = session.get("email");
  return {
    user: userId ? { userId, username, email, avatar } : null
  };
}
export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-10 w-full">
        <div className="mx-auto flex max-w-4xl justify-between">
          <div className="flex items-center"></div>
          <div className="flex items-center gap-4 py-3">
            <a href="https://github.com/collins401/rr7-stack" target="_blank" rel="noreferrer">
              <Github className="size-5" />
            </a>
            <ThemeSelector />
            {user ? (
              <UserNav user={user} />
            ) : (
              <Link to="/dashboard" prefetch="intent">
                <UserRound size={18} />
              </Link>
            )}
            <Link to="/auth/sign-in" prefetch="viewport"></Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
