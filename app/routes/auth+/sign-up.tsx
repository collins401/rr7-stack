import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { data, Link, redirect, useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import { toast } from "sonner";
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
const formSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符"),
  password: z.string().min(6, "密码至少6个字符"),
  email: z.string().email("请输入正确的邮箱")
});
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as z.infer<typeof formSchema>;
  // 检查用户名是否已存在
  const existingUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, formDataObj.username)
  });
  if (existingUser) {
    return data({ message: "用户名已存在" }, { status: 400 });
  }

  // 检查邮箱是否已存在
  const existingEmail = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, formDataObj.email)
  });
  if (existingEmail) {
    return data({ message: "邮箱已被注册" }, { status: 400 });
  }

  try {
    // 对密码进行加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(formDataObj.password, salt);

    // 创建新用户
    await db.insert(user).values({
      ...formDataObj,
      password: hashedPassword
    });

    // 查询新创建的用户
    const newUser = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.username, formDataObj.username)
    });

    if (!newUser) {
      return data({ message: "用户创建失败" }, { status: 400 });
    }
    // 获取 session 并设置用户信息
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", newUser.id);
    session.set("username", formDataObj.username);
    session.set("email", formDataObj.email);

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

export default function SignUp() {
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetcher.submit(values, { method: "post" });
  }

  useEffect(() => {
    if (fetcher.data) {
      toast.error(fetcher.data.message);
    }
  }, [fetcher.data]);

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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input autoComplete="email" type="email" placeholder="请输入邮箱" {...field} />
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
