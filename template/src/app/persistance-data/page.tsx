"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data: NetworkData[] = [
  {
    id: "1",
    ip: "192.168.1.1",
    mac: "00:1A:2B:3C:4D:5E",
    vendor: "Cisco",
  },
  {
    id: "2",
    ip: "192.168.1.2",
    mac: "00:1A:2B:3C:4D:5F",
    vendor: "Netgear",
  },
  {
    id: "3",
    ip: "192.168.1.3",
    mac: "00:1A:2B:3C:4D:60",
    vendor: "Dell",
  },
  {
    id: "4",
    ip: "192.168.1.4",
    mac: "00:1A:2B:3C:4D:61",
    vendor: "HP",
  },
  {
    id: "5",
    ip: "192.168.1.5",
    mac: "00:1A:2B:3C:4D:62",
    vendor: "Cisco",
  },
]

export type NetworkData = {
  id: string
  ip: string
  mac: string
  vendor: string
}

export default function NetworkTable() {
  const columns: ColumnDef<NetworkData>[] = [
    {
      id: "number",
      header: "#",
      cell: ({ row }) => <div>{Number(row.id) + 1}</div>,
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
      header: "MAC Address",
      cell: ({ row }) => <div>{row.getValue("mac")}</div>,
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => <div>{row.getValue("vendor")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const device = row.original

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
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
  })

  return (
    <div className="p-4 w-full">
        <p className=" text-sm mb-4">
        **The scan results from scanned performed from this page are stored and can be accessed later for reference, analysis, 
        or further actions.
        </p>
        <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="gateway_ip">Router Gateway (e.g. 192.168.1.0/24)</Label>
            <Input
              id="gateway_ip"
              placeholder="IP address of your router e.g, 192.168.1.0/24"
              required
            />
          </div>
        </div>
        <div className="mt-2">
          <Button type="submit">
            Scan Network
          </Button>
        </div>
      </form>
        
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
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                  )
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
  )
}
