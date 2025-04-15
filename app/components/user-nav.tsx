import { useNavigate, useSubmit } from "react-router";
import { KeyRound, ListTodo, LogOut, User, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { loader } from "@/routes/_site+/_layout";
import { Button } from "./ui/button";

export function UserNav({ user }: { user: Awaited<ReturnType<typeof loader>>["user"] }) {
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-8 rounded-full">
          {/* <User className="text-green-600" /> */}
          <Avatar className="size-8">
            <AvatarImage
              src={user?.avatar || "/avatar.svg"}
              alt={user?.username ?? "User avatar"}
            />
            <AvatarFallback className="text-xs font-bold uppercase">
              {user?.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <strong className="font-medium">{user?.username}</strong>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          <UserCircle className="mr-2 size-4" />
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard/todo");
          }}
        >
          <ListTodo className="mr-2 size-4" />
          Todo List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/dashboard/change-password");
          }}
        >
          <KeyRound className="mr-2 size-4" />
          修改密码
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => {
            setTimeout(() => {
              submit(null, { method: "POST", action: "/auth/logout" });
            }, 100);
          }}
        >
          <LogOut className="mr-2 size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
