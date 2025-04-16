import { SquareTerminal } from "lucide-react";
import { Github } from "@/components/icons";

export default function IndexRoute() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <div className="gradient-bg relative px-4 py-40 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="feature-pill flex items-center gap-2 rounded-full px-4 py-2">
              {/* <iconify-icon icon="tabler:rocket" width="20"></iconify-icon> */}
              <span>v1.0 Released</span>
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            <span className="inline-block">
              Build <span className="text-yellow-300">Fullstack</span> Apps
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90 md:text-2xl">
            React-router v7 + TypeScript + Drizzle-orm -{" "}
            <span className="font-semibold">Zero Config</span>
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#get-started"
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-medium text-purple-700 shadow-lg transition hover:bg-gray-100"
            >
              {/* <iconify-icon icon="octicon:terminal-16"></iconify-icon> */}
              <SquareTerminal /> Get Started
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl flex-1 px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              {/* <iconify-icon icon="ph:stack-fill"></iconify-icon> */}
              Complete Tech Stack
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-purple-600 p-2"></div>
                <div>
                  <h3 className="font-bold">React-Route V7</h3>
                  <p className="text-sm text-muted-foreground">
                    A user‑obsessed, standards‑focused
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-blue-600 p-2"></div>
                <div>
                  <h3 className="font-bold">Drizzle ORM</h3>
                  <p className="text-sm text-muted-foreground">
                    Type-safe database to frontend workflow
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-green-600 p-2">
                  {/* <iconify-icon icon="mdi:shield-account" width="20"></iconify-icon> */}
                </div>
                <div>
                  <h3 className="font-bold">Better-Auth</h3>
                  <p className="text-sm text-muted-foreground">
                    Role-based permissions out of the box
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-amber-600 p-2">
                  {/* <iconify-icon icon="simple-icons:tailwindcss" width="20"></iconify-icon> */}
                </div>
                <div>
                  <h3 className="font-bold">shadcn/ui + Tailwind</h3>
                  <p className="text-sm text-muted-foreground">Beautiful, accessible components</p>
                </div>
              </div>
            </div>
          </div>

          <div className="code-block overflow-hidden p-4">
            <div className="mb-3 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <pre>
              <pre className="overflow-x-auto font-mono text-sm text-gray-300">
                <code>
                  <span className="text-purple-400">// Fullstack type-safety in action</span> <br />
                  <span className="text-blue-400">import</span> &#123; db &#125;{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-green-400">"@/database/db.server"</span>; <br />
                  <span className="text-blue-400">import</span> &#123; getSession &#125;{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-green-400">"@/lib/session"</span>; <br />
                  <span className="text-blue-400">import type</span> &#123; Route &#125;{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-green-400">"./+types/_layout"</span>; <br />
                  <br />
                  <span className="text-blue-400">export async function</span>{" "}
                  <span className="text-yellow-300">loader</span>&#40;&#123; request &#125;:
                  Route.LoaderArgs&#41; &#123; <br />
                  <span className="text-blue-400">&nbsp;&nbsp;const</span> session ={" "}
                  <span className="text-yellow-300">
                    await getSession&#40;request.headers.get("Cookie")&#41;
                  </span>
                  ; <br /> <br />
                  <span className="text-blue-400">&nbsp;&nbsp;if</span> &#40;
                  <span className="text-blue-400">!</span>
                  session.<span className="text-yellow-300">has</span>&#40;
                  <span className="text-green-400">"userId"</span>&#41;&#41; &#123; <br />
                  <span className="text-blue-400">&nbsp;&nbsp;&nbsp;&nbsp;throw</span>{" "}
                  redirect("/auth/sign-in"); <br />
                  &nbsp;&nbsp;&#125;
                  <br />
                  <span className="text-blue-400">&nbsp;&nbsp;const</span> user ={" "}
                  <span className="text-blue-400">await</span> db.query.users.
                  <span className="text-yellow-300">findMany</span>&#40;&#123; <br />
                  <span className="text-blue-400">&nbsp;&nbsp;&nbsp;&nbsp;where</span>: &#40;users,
                  &#123; eq &#125;&#41; =&gt; <span className="text-yellow-300">eq</span>
                  &#40;users.id, session.get("userId")&#41;, <br />
                  &nbsp;&nbsp;&#125;&#41;; <br />
                  <span className="text-blue-400">&nbsp;&nbsp;return</span> user <br />
                  &#125;
                </code>
              </pre>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
