import { redirect } from "react-router";
import db from "@/database/db.server";
import { user } from "@/database/schema";
import { commitSession, getSession } from "@/lib/session";
import { Route } from "./+types/api.auth.$";
async function getAccessToken(code: string) {
  console.log("getAccessToken", process.env.REDIRECT_URI);
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID as string,
        client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        redirect_uri: process.env.REDIRECT_URI as string,
        code
      })
    });
    const responseData = await response.json();
    console.log("responseData", responseData);
    return responseData.access_token;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to fetch access token");
  }
}

async function getUserInfo(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  const response = await res.json();
  console.log("response", response);
  return response;
}
export async function loader({ request }: Route.LoaderArgs) {
  // 拿到url code参数
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  console.log("code", code);
  if (!code) {
    throw new Error("No code provided");
  }

  const accessToken = await getAccessToken(code);
  const userInfo = await getUserInfo(accessToken);
  const session = await getSession(request.headers.get("Cookie"));
  // 检查用户是否存在，不存在则创建
  let existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, userInfo.email)
  });

  if (!existingUser) {
    await db.insert(user).values({
      username: userInfo.login,
      email: userInfo.email,
      avatar: userInfo.avatar_url,
      provider: "github",
      password: "" // GitHub 登录的用户不需要密码
    });
    // 获取刚创建的用户
    existingUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, userInfo.email)
    });
  }
  session.set("userId", userInfo.id);
  session.set("username", userInfo.login);
  session.set("avatar", userInfo.avatar_url);
  session.set("email", userInfo.email);
  await commitSession(session);
  throw redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
  // await fetch("/api/github/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json"
  //   },
  //   body: JSON.stringify({
  //     code
  //   })
  // });
}
