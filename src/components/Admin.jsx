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
  SidebarFooter,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger
} from "./animate-ui/components/radix/sidebar";
import { Upload } from "./animate-ui/icons/upload";
import { ChartNoAxesColumn } from "./animate-ui/icons/chart-no-axes-column";
import { useState } from "react";

export function Admin() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const [menuItem, setMenuItem] = useState("")

  function menuSelected(item) {
  setMenuItem(item)
}

  return (
    <>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader></SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
  <SidebarMenuButton tooltip="Documents" onClick={() => menuSelected("documents")}>
    <Upload animateOnHover /> Documents
  </SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
  <SidebarMenuButton tooltip="Stats" onClick={() => menuSelected("stats")}>
    <ChartNoAxesColumn animateOnHover />Stats
  </SidebarMenuButton>
</SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <button onClick={logout}>Logout</button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <SidebarTrigger />
          {menuItem === "stats" ? <Stats /> : null}
          {menuItem === "documents" ? <Documents /> : null}
          
          <div style={{ color: "black" }}>Admin Dashboard</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
