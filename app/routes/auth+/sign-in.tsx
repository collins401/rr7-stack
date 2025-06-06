import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { data, Link, redirect } from "react-router";
import { useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import db from "@/database/db.server";
import { commitSession, getSession } from "@/lib/session";
import { Route } from "./+types/sign-in";

export async function loader() {
  return {
    GITHUB_URL: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  };
}

const formSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码")
});
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as z.infer<typeof formSchema>;
  try {
    // 查询用户
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, formDataObj.username)
    });

    if (!user) {
      return data({ message: "用户名或密码错误" }, { status: 400 });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(formDataObj.password, user.password);
    if (!isValidPassword) {
      return data({ message: "用户名或密码错误" }, { status: 400 });
    }

    // 设置 session
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);
    session.set("username", formDataObj.username);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    return data({ message: "登录失败，请稍后重试" }, { status: 500 });
  }
}

export default function SignIn({ loaderData }: Route.ComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    fetcher.submit(formData, { method: "post" });
  }

  useEffect(() => {
    if (fetcher.data) {
      toast.warning(fetcher.data.message);
    }
  }, [fetcher.data]);

  function loginGithub() {
    location.href = loaderData.GITHUB_URL;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">登录账户</h1>
          <p className="text-balance text-sm text-muted-foreground">请输入您的账户信息进行登录</p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input autoComplete="username" placeholder="请输入用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>密码</FormLabel>
                  <Link
                    to="/auth/forgot"
                    prefetch="intent"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="请输入密码"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeClosed className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            登录
          </Button>
          {/* 其余按钮和链接部分保持不变 */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">or</span>
          </div>
          <Button variant="outline" type="button" className="w-full" onClick={loginGithub}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          没有账户?{" "}
          <Link to="/auth/sign-up" className="underline underline-offset-4">
            立即注册
          </Link>
        </div>
      </form>
    </Form>
  );
}
