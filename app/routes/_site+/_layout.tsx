import { Form, Link, Outlet, useLoaderData } from "react-router";
import { UserRound } from "lucide-react";
import { Logo } from "@/components/icons";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { getSession } from "@/lib/session";
import { Route } from "./+types/_layout";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const username = session.get("username");
  console.log("userId", userId);
  return {
    title: "site layout",
    user: userId ? { userId, username } : null
  };
}
export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <Logo />
            <span>RR7-STACK</span>
          </div>
          <div className="flex items-center gap-4 py-3">
            {user ? (
              <div className="flex items-center gap-4">
                {/* 欢迎, {user.username} */}
                <UserNav user={user} />
              </div>
            ) : (
              <Button variant="link" size="icon" className="rounded-full">
                <Link to="/dashboard">
                  <UserRound />
                </Link>
              </Button>
            )}

            <ThemeSelector />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <div className="container mx-auto py-10 text-center text-sm text-muted-foreground">
          © 2025 rr7-stack
        </div>
      </footer>
    </div>
  );
}
