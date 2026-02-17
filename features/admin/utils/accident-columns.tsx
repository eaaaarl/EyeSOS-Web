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
import { getSeverityColor, getStatusColor } from "../helpers/accident-helpers"

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
                <div className="pt-1 text-[10px] text-muted-foreground grid gap-0.5">
                    <div className="flex items-center gap-1">
                        <span className="font-medium">Coords:</span>
                        {row.original.latitude?.toFixed(5)}, {row.original.longitude?.toFixed(5)}
                    </div>
                    {(row.original.location_quality || row.original.location_accuracy) && (
                        <div className="flex items-center gap-2">
                            {row.original.location_quality && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Qual:</span> {row.original.location_quality}
                                </div>
                            )}
                            {row.original.location_accuracy && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Acc:</span> {row.original.location_accuracy}
                                </div>
                            )}
                        </div>
                    )}
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
            <Badge className={getStatusColor(row.original.accident_status)}>
                {row.original.accident_status || "Unknown"}
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
