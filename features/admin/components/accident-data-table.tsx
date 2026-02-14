"use client"

import * as React from "react"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconEye,
    IconMapPin,
    IconPhone,
    IconUser,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

export const accidentSchema = z.object({
    id: z.string(),
    reportNumber: z.string(),
    severity: z.string(),
    reporterName: z.string(),
    reporterContact: z.string(),
    reporterNotes: z.string(),
    locationAddress: z.string(),
    barangay: z.string().nullable(),
    municipality: z.string().nullable(),
    status: z.string(),
    responseTime: z.string(),
    createdAt: z.string(),
})

type AccidentReport = z.infer<typeof accidentSchema>

function getSeverityColor(severity: string) {
    switch (severity.toLowerCase()) {
        case "major":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "moderate":
            return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-700"
        case "minor":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "active":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "in progress":
            return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700"
        case "resolved":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

function AccidentDetailsDialog({ report }: { report: AccidentReport }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <IconEye className="size-4" />
                    <span className="sr-only">View details</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconMapPin className="size-5 text-red-500" />
                        Accident Report: {report.reportNumber}
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about the reported accident
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Severity</Label>
                            <Badge className={getSeverityColor(report.severity)}>
                                {report.severity.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Status</Label>
                            <Badge className={getStatusColor(report.status)}>
                                {report.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Location</Label>
                        <div className="flex items-start gap-2">
                            <IconMapPin className="size-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{report.locationAddress}</p>
                                <p className="text-muted-foreground text-sm">
                                    {report.barangay}, {report.municipality}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Reporter Information</Label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <IconUser className="size-4 text-muted-foreground" />
                                <span className="font-medium">{report.reporterName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconPhone className="size-4 text-muted-foreground" />
                                <span className="text-sm">{report.reporterContact}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Notes</Label>
                        <p className="text-sm bg-muted p-3 rounded-md">
                            {report.reporterNotes}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Response Time</Label>
                            <p className="font-medium">{report.responseTime}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Reported At</Label>
                            <p className="text-sm">
                                {new Date(report.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const columns: ColumnDef<AccidentReport>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "reportNumber",
        header: "Report #",
        cell: ({ row }) => (
            <div className="font-mono text-xs font-medium">
                {row.original.reportNumber}
            </div>
        ),
    },
    {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => (
            <Badge className={getSeverityColor(row.original.severity)}>
                {row.original.severity.toUpperCase()}
            </Badge>
        ),
    },
    {
        accessorKey: "locationAddress",
        header: "Location",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <div className="font-medium truncate">{row.original.locationAddress}</div>
                <div className="text-muted-foreground text-xs truncate">
                    {row.original.barangay}, {row.original.municipality}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "reporterName",
        header: "Reporter",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.reporterName}</div>
                <div className="text-muted-foreground text-xs">{row.original.reporterContact}</div>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.original.status)}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "responseTime",
        header: "Response",
        cell: ({ row }) => (
            <div className="text-sm font-medium">{row.original.responseTime}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <AccidentDetailsDialog report={row.original} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>View on Map</DropdownMenuItem>
                        <DropdownMenuItem>Contact Reporter</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Export Report</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]

export function AccidentDataTable({
    data: initialData,
}: {
    data: AccidentReport[]
}) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data: initialData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="flex flex-col gap-4 px-4 lg:px-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search reports..."
                        value={(table.getColumn("reportNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("reportNumber")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Select
                        value={(table.getColumn("severity")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("severity")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Severity</SelectItem>
                            <SelectItem value="major">Major</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="minor">Minor</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Columns
                            <IconChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" &&
                                    column.getCanHide()
                            )
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

            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                                    No accident reports found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
