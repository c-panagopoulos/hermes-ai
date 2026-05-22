import { useNavigate } from "react-router-dom";
import Stats from "./Stats";
import Documents from "./Documents";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenuItem,
  SidebarInset,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "./animate-ui/components/radix/sidebar";
import { Upload } from "./animate-ui/icons/upload";
import { ChartNoAxesColumn } from "./animate-ui/icons/chart-no-axes-column";
import { LogOut } from "./animate-ui/icons/log-out";
import { useState } from "react";

export function Admin() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const [menuItem, setMenuItem] = useState("stats");

  function menuSelected(item) {
    setMenuItem(item);
  }

  return (
    <>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader></SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={{ children: "Documents", side: "right" }}
                  onClick={() => menuSelected("documents")}
                >
                  <Upload animateOnHover /> Documents
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={{ children: "Stats", side: "right" }}
                  onClick={() => menuSelected("stats")}
                >
                  <ChartNoAxesColumn animateOnHover />
                  Stats
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarMenuButton tooltip={{ children: "Logout", side: "right" }}  onClick={logout}>
            <LogOut animateOnHover />
            Logout
          </SidebarMenuButton>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <SidebarTrigger />
          {menuItem === "stats" ? <Stats /> : null}
          {menuItem === "documents" ? <Documents /> : null}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
