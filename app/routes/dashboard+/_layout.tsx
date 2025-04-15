import { Outlet, redirect } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { Route } from "./+types/_layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const username = session.get("username");
  const email = session.get("email");
  const avatar = session.get("avatar");
  if (!userId || !username) {
    throw redirect("/auth/sign-in");
  }
  return {
    user: { userId, username, avatar, email }
  };
}
export default function LayoutRoute({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={loaderData.user} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
