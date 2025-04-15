import { Link, Outlet } from "react-router";
import { UserRound } from "lucide-react";
import { Logo } from "@/components/icons";
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
      <header>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <Logo />
            <span>RR7-STACK</span>
          </div>
          <div className="flex items-center gap-3 py-3">
            {user ? (
              <UserNav user={user} />
            ) : (
              <Link to="/dashboard">
                <UserRound size={18} />
              </Link>
            )}
            <ThemeSelector />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
