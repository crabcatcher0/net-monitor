"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type NetworkData = {
  id: string;
  ip: string;
  mac: string;
  scan_date: string;
};

export default function NetworkTable() {
  const [data, setData] = React.useState<NetworkData[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanMessage, setScanMessage] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8001/show-result-db/");
        const result = await response.json();

        if (response.ok) {
          const transformedData = result.data.map((item: any, index: number) => ({
            id: (index + 1).toString(),
            ip: item[0],
            mac: item[1],
            scan_date: new Date(item[2]).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }) + 
            ", " +
            new Date(item[2]).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          }));
          setData(transformedData);
        } else {
          console.error("Failed to fetch data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const columns: ColumnDef<NetworkData>[] = [
    {
      id: "number",
      header: "#",
      cell: ({ row }) => <div>{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => <div>{row.getValue("ip")}</div>,
    },
    {
      accessorKey: "mac",
      header: "MAC Address and Vendor",
      cell: ({ row }) => <div>{row.getValue("mac")}</div>,
    },
    {
      accessorKey: "scan_date",
      header: "Scan Date and Time",
      cell: ({ row }) => <div>{row.getValue("scan_date")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const device = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                Flag as home device
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(device.ip)}
              >
                Copy IP Address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(device.mac)}
              >
                Copy MAC Address
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleScanNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    const gatewayIp = (document.getElementById("gateway_ip") as HTMLInputElement)
      .value;

    if (!gatewayIp) {
      alert("Please enter a valid router gateway IP.");
      return;
    }

    setIsScanning(true);
    setScanMessage("");

    try {
      const response = await fetch("http://localhost:8001/scan-save-db/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ network_gateway: gatewayIp }),
      });

      const result = await response.json();

      if (response.ok) {
        setScanMessage(result.message || "Network scan completed successfully.");
      } else {
        setScanMessage(result.message || "Failed to complete network scan.");
      }
    } catch (error) {
      console.error("Error:", error);
      setScanMessage("An error occurred while performing the network scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <p className="text-sm mb-4">
        **The scan results from scans performed from this page are stored and
        can be accessed later for reference, analysis, or further actions.
      </p>
      <form onSubmit={handleScanNetwork}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="gateway_ip">
              Router Gateway (e.g. 192.168.1.0/24)
            </Label>
            <Input
              id="gateway_ip"
              placeholder="IP address of your router e.g., 192.168.1.0/24"
              required
            />
          </div>
        </div>
        <div className="mt-3">
          <Button type="submit" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Scan Network"}
          </Button>
        </div>
      </form>
      {scanMessage && <p className="mt-4 text-green-600">{scanMessage}</p>}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter IP addresses..."
          value={(table.getColumn("ip")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ip")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {data.length === 0 && (
        <pre className="bg-gray-200 p-4 rounded">
          No data. Raw Data: {JSON.stringify(data, null, 2)}
        </pre>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
