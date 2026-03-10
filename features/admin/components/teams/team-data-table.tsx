"use client"

import * as React from "react"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDots,
    IconEdit,
    IconTrash,
    IconEye,
    IconAlertTriangle,
    IconLoader2,
} from "@tabler/icons-react"
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from "sonner"
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

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Badge } from "@/components/ui/badge"
import { Team } from "./team-stats-cards"
import Link from "next/link"
import { TeamDetailsModal } from "./team-details-modal"
import { useDeleteTeamMutation } from "@/features/admin/api/adminApi"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function TeamDataTable({
    data,
    isLoading,
}: {
    data: Team[]
    isLoading?: boolean
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [viewTeamId, setViewTeamId] = React.useState<string | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
    const [deleteTeamId, setDeleteTeamId] = React.useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation()

    const handleViewDetails = (id: string) => {
        setViewTeamId(id)
        setIsDetailsOpen(true)
    }

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setDeleteTeamId(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deleteTeamId) return

        try {
            const result = await deleteTeam(deleteTeamId).unwrap()
            if (result.meta.success) {
                toast.success("Team deleted successfully")
            } else {
                toast.error(result.meta.message || "Failed to delete team")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the team"
            toast.error(errorMessage)
        } finally {
            setIsDeleteDialogOpen(false)
            setDeleteTeamId(null)
        }
    }

    const columns: ColumnDef<Team>[] = [
        {
            accessorKey: "name",
            header: "Team Name",
            cell: ({ row }) => (
                <div className="font-medium text-primary">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "leader",
            header: "Team Leader",
        },
        {
            accessorKey: "membersCount",
            header: "Members",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-2 py-0">
                        {row.getValue("membersCount")}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={
                            status === "active"
                                ? "default"
                                : status === "on-call"
                                    ? "secondary"
                                    : "outline"
                        }
                        className="capitalize"
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "performance",
            header: "Performance",
            cell: ({ row }) => {
                const value = row.getValue("performance") as number
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${value}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium">{value}%</span>
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const team = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <IconDots className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewDetails(team.id)}>
                                <IconEye className="size-4" />
                                View Details
                            </DropdownMenuItem>
                            <Link href={`/admin/teams/edit/${team.id}`}>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <IconEdit className="size-4" />
                                    Edit Team
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 text-destructive cursor-pointer"
                                onClick={(e) => handleDeleteClick(team.id, e)}
                            >
                                <IconTrash className="size-4" />
                                Delete Team
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]


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
        <div className="flex flex-col gap-4 px-4 lg:px-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search teams..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on-call">On-Call</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Columns
                                <IconChevronDown className="ml-2 size-4" />
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
                    <Link href="/admin/teams/add">
                        <Button>
                            Add Team
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted/50">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex justify-center items-center h-full">
                                        <IconLoader2 className="animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/50 transition-colors"
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
                                    No teams found.
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
                            <IconChevronsLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <TeamDetailsModal
                teamId={viewTeamId}
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md p-6 border border-slate-200 bg-white shadow-xl rounded-2xl">
                    <DialogHeader className="flex flex-col items-center text-center gap-4">
                        <div className="size-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 animate-in fade-in zoom-in duration-300">
                            <IconAlertTriangle className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                Delete Team?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 max-w-[280px]">
                                This action cannot be undone. All team data and member assignments will be removed.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-3 mt-6 sm:justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 rounded-xl h-11 font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl h-11 font-semibold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95 text-white flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin text-white/80" />
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
