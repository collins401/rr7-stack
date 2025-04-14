import { redirect } from "react-router";
import { destroySession, getSession } from "@/lib/session";
import { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/auth/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}
