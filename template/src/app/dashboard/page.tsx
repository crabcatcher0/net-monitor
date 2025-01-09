import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const scanResult = [
  {
    ip: "192.168.1.2",
    mac: "00:1A:2B:3C:4D:5E",
  },
  {
    ip: "192.168.1.3",
    mac: "00:1B:2C:3D:4E:5F",
  },
  {
    ip: "192.168.1.4",
    mac: "00:1C:2D:3E:4F:5A",
  },
  {
    ip: "192.168.1.5",
    mac: "00:1D:2E:3F:4A:5B",
  },
  {
    ip: "192.168.1.6",
    mac: "00:1E:2F:3A:4B:5C",
  },
  {
    ip: "192.168.1.7",
    mac: "00:1F:2A:3B:4C:5D",
  },
  {
    ip: "192.168.1.8",
    mac: "00:2A:3B:4C:5D:6E",
  },
  {
    ip: "192.168.1.9",
    mac: "00:2B:3C:4D:5E:6F",
  },
  {
    ip: "192.168.1.10",
    mac: "00:2C:3D:4E:5F:6A",
  },
  {
    ip: "192.168.1.11",
    mac: "00:2D:3E:4F:5A:6B",
  },
]


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Scan Summary
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Table>
              <TableCaption>List of devices connected to your network.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanResult.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{result.ip}</TableCell>
                    <TableCell>{result.mac}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
