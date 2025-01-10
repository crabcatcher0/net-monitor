import { Command, SquareTerminal } from "lucide-react";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavMain from "./nav-main";

const data = {
  teams: [
    {
      name: "Net-Monitor",
      logo: Command,
      plan: "v.0.1",
    },
  ],
  navMain: [
    {
      title: "Network",
      url: "scan-summary",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Scan Summary",
          url: "scan-summary",
        },
      ],
    },
  ],
};

export function AppSidebar({
  onItemSelect,
}: {
  onItemSelect: (url: string) => void;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onItemSelect={onItemSelect} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
