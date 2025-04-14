import { useForm } from "react-hook-form";
import { data, Link, redirect, useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import * as z from "zod";
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
import { user } from "@/database/schema";
import { commitSession, getSession } from "@/lib/session";
import { Route } from "./+types/sign-up";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("Username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  console.log("username", username);
  if (!username || !password || !confirmPassword) {
    return data({ message: "所有字段都是必填的" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return data({ message: "密码不一致" }, { status: 400 });
  }

  // 检查用户名是否已存在
  const existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username)
  });
  if (existingUser) {
    return data({ message: "用户名已存在" }, { status: 400 });
  }

  try {
    // 对密码进行加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    await db.insert(user).values({
      username,
      password: hashedPassword
    });

    // 查询新创建的用户
    const newUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, username)
    });

    if (!newUser) {
      throw new Error("用户创建失败");
    }

    console.log("注册成功", newUser);
    // 获取 session 并设置用户信息
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", newUser.id);
    session.set("username", username);

    // 返回成功响应，并设置 session cookie
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    return data({ message: "注册失败，请稍后重试" }, { status: 500 });
  }
}
const formSchema = z
  .object({
    username: z.string().min(2, "用户名至少2个字符"),
    password: z.string().min(6, "密码至少6个字符"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "密码不一致",
    path: ["confirmPassword"]
  });

export default function SignUp({ actionData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("Username", values.username);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    fetcher.submit(formData, { method: "post" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">创建账户</h1>
          <p className="text-balance text-sm text-muted-foreground">请输入以下信息来创建您的账户</p>
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
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="请输入密码"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>确认密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="请再次输入密码"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            注册
          </Button>
        </div>
        <div className="text-center text-sm">
          已有账户？{" "}
          <Link to="/auth/sign-in" prefetch="intent" className="underline underline-offset-4">
            立即登录
          </Link>
        </div>
      </form>
    </Form>
  );
}
