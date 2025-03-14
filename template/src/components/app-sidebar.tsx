import { Command, SquareTerminal, LifeBuoy, Send } from "lucide-react";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavMain from "./nav-main";
import { NavSecondary } from "@/components/nav-secondary"


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
        {
          title: "Monitor Network",
          url: "persistance-data"
        },
        {
          title: "Target Device",
          url: "target-device"
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "https://github.com/crabcatcher0/net-monitor",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "https://github.com/crabcatcher0/net-monitor",
      icon: Send,
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
