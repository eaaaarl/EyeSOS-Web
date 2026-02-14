"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { AccidentReport } from "../api/interface"
import { AccidentDetailsDialog } from "../components/accidents/accident-details-dialog"

function getSeverityColor(severity: string) {
    if (!severity) return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    switch (severity.toLowerCase()) {
        case "critical":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "high":
            return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-700"
        case "moderate":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
        case "minor":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

function getStatusColor(status: string) {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
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

export const accidentColumns: ColumnDef<AccidentReport>[] = [
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
        accessorKey: "report_number",
        header: "Report #",
        cell: ({ row }) => (
            <div className="font-mono text-xs font-medium">
                {row.original.report_number}
            </div>
        ),
    },
    {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => (
            <Badge className={getSeverityColor(row.original.severity)}>
                {row.original.severity?.toUpperCase() || "UNKNOWN"}
            </Badge>
        ),
    },
    {
        accessorKey: "location_address",
        header: "Location",
        cell: ({ row }) => (
            <div className="max-w-xs space-y-1">
                <div className="font-medium truncate" title={row.original.location_address}>
                    {row.original.location_address}
                </div>
                {row.original.landmark && (
                    <div className="text-muted-foreground text-xs flex items-center gap-1">
                        <span className="font-medium">Landmark:</span> {row.original.landmark}
                    </div>
                )}
                <div className="text-muted-foreground text-xs truncate">
                    {[row.original.barangay, row.original.municipality, row.original.province]
                        .filter(Boolean)
                        .join(", ")}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "reporter_name",
        header: "Reporter",
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.reporter_name}</div>
                <div className="text-muted-foreground text-xs">{row.original.reporter_contact}</div>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.original.status)}>
                {row.original.status || "Unknown"}
            </Badge>
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
