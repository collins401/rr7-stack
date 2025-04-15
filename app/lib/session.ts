import { createCookieSessionStorage } from "react-router";

type SessionData = {
  userId: string;
  username: string;
  avatar: string;
  email: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "rr7_stack_session",

    // all of these are optional
    // domain: "reactrouter.com",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
    secrets: ["2ae64e8991e30000ba2f5b1721b9da0e"],
    secure: true
  }
});

export { commitSession, destroySession, getSession };
