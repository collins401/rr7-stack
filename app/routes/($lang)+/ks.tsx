import { data } from "react-router";
import db from "@/database/db.server";
import { getLang } from "@/lib";
import { locales } from "@/locales";
import type { Route } from "./+types/ks";
export async function loader({ params }: Route.LoaderArgs) {
  const lang = getLang(params);
  console.log("this is lang", lang);
  const todos = await db.query.todo.findMany({
    orderBy: (todo, { desc }) => [desc(todo.createdAt)]
  });
  return data(
    {
      todos,
      locales: locales[lang]
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60", // 缓存60秒
        "Content-Type": "application/json",
        "Server-Timing": `page;dur=10000;desc="Page query"`
      }
    }
  );
}
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  return (
    <>
      <div>title: {loaderData.locales.title}</div>
    </>
  );
}
