import { Form, Link, Outlet, useLoaderData } from "react-router";
import { sql } from "drizzle-orm/sql";
import { UserRound } from "lucide-react";
import { Logo } from "@/components/icons";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import db from "@/database/db.server";
import { visitorStats } from "@/database/schema";
import { getSession } from "@/lib/session";
import { Route } from "./+types/_layout";
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const username = session.get("username");

  // 获取访客IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get("x-real-ip");

  // 更新访问统计
  await db
    .insert(visitorStats)
    .values({
      ip: ip || "unknown"
    })
    .onConflictDoUpdate({
      target: [visitorStats.ip],
      set: {
        visitCount: sql`visitor_stats.visit_count + 1`,
        lastVisit: sql`(unixepoch())`
      }
    });

  // 获取总访问量
  const [totalVisits] = await db
    .select({
      total: sql<number>`sum(${visitorStats.visitCount})`
    })
    .from(visitorStats);

  return {
    user: userId ? { userId, username } : null,
    totalVisits: totalVisits.total || 0
  };
}
export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  const { user, totalVisits } = loaderData;

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center">
            <Logo />
            <span>RR7-STACK</span>
          </div>
          <div className="flex items-center gap-2 py-3">
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
      <footer>
        <div className="container mx-auto py-10 text-center text-sm text-muted-foreground">
          <div>© 2025 rr7-stack</div>
          <div className="mt-2">总访问量：{totalVisits}</div>
        </div>
      </footer>
    </div>
  );
}
