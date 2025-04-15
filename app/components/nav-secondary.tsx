import * as React from "react";
import { Link } from "react-router";
import { House, Palette } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { ThemeSelector } from "./theme-selector";
export function NavSecondary({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <Link to="/" className="flex gap-2">
                <House size={18} />
                <span className="flex-1">Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <div className="flex gap-2">
                <Palette size={18} />
                <ThemeSelector align={"start"}>
                  <span className="flex-1">Theme</span>
                </ThemeSelector>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
