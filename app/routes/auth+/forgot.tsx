import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeClosed, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">忘记密码</h1>
        <p className="text-balance text-sm text-muted-foreground">
          输入您的邮箱地址，我们将向您发送重置密码的链接
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">邮箱地址</Label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <Button type="submit" className="w-full">
          发送重置链接
        </Button>
      </div>
      <div className="text-center text-sm">
        想起密码了？{" "}
        <Link to="/auth/sign-in" className="underline underline-offset-4">
          返回登录
        </Link>
      </div>
    </form>
  );
}
