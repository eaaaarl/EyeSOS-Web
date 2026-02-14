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
    IconMail,
    IconPhone,
    IconMapPin,
    IconUser,
    IconCalendar,
    IconShieldCheck,
    IconBuilding,
    IconUsers,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Separator } from '@/components/ui/separator'

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    mobileNo: z.string(),
    avatarUrl: z.string(),
    user_type: z.enum(["bystander", "blgu", "lgu", "admin"]),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    organizations_id: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    birthdate: z.string().optional(),
    bio: z.string().optional(),
    permanent_address: z.string(),
})

type UserProfile = z.infer<typeof userSchema>

function getUserTypeColor(userType: string) {
    switch (userType.toLowerCase()) {
        case "admin":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "lgu":
            return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700"
        case "blgu":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
        case "bystander":
            return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

function getUserTypeIcon(userType: string) {
    switch (userType.toLowerCase()) {
        case "admin":
            return <IconShieldCheck className="size-3" />
        case "lgu":
            return <IconBuilding className="size-3" />
        case "blgu":
            return <IconUsers className="size-3" />
        case "bystander":
            return <IconEye className="size-3" />
        default:
            return <IconUser className="size-3" />
    }
}

function getUserTypeLabel(userType: string) {
    switch (userType.toLowerCase()) {
        case "admin":
            return "Admin"
        case "lgu":
            return "LGU"
        case "blgu":
            return "BLGU"
        case "bystander":
            return "Bystander"
        default:
            return userType
    }
}

function UserDetailsDialog({ user }: { user: UserProfile }) {
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
                    <DialogTitle className="flex items-center gap-3">
                        <Avatar className="size-12">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                {user.name}
                                <Badge className={getUserTypeColor(user.user_type)}>
                                    {getUserTypeIcon(user.user_type)}
                                    {getUserTypeLabel(user.user_type)}
                                </Badge>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Complete user profile and emergency contact information
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Email Address</Label>
                            <div className="flex items-center gap-2">
                                <IconMail className="size-4 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Mobile Number</Label>
                            <div className="flex items-center gap-2">
                                <IconPhone className="size-4 text-muted-foreground" />
                                <span className="text-sm">{user.mobileNo}</span>
                            </div>
                        </div>
                    </div>

                    {user.birthdate && (
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                            <div className="flex items-center gap-2">
                                <IconCalendar className="size-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {new Date(user.birthdate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Permanent Address</Label>
                        <div className="flex items-start gap-2">
                            <IconMapPin className="size-4 mt-0.5 text-muted-foreground" />
                            <p className="text-sm">{user.permanent_address}</p>
                        </div>
                    </div>

                    {user.bio && (
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Bio / Role</Label>
                            <p className="text-sm bg-muted p-3 rounded-md">
                                {user.bio}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Emergency Contact</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Contact Name</Label>
                                <div className="flex items-center gap-2">
                                    <IconUser className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{user.emergency_contact_name || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Contact Number</Label>
                                <div className="flex items-center gap-2">
                                    <IconPhone className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{user.emergency_contact_number || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Organization ID</Label>
                            <p className="text-sm font-mono">{user.organizations_id || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">User ID</Label>
                            <p className="text-sm font-mono">{user.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Created At</Label>
                            <p className="text-sm">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Last Updated</Label>
                            <p className="text-sm">
                                {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const columns: ColumnDef<UserProfile>[] = [
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
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="size-10">
                    <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
                    <AvatarFallback>{row.original.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-muted-foreground text-xs">{row.original.email}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "user_type",
        header: "Type",
        cell: ({ row }) => (
            <Badge className={getUserTypeColor(row.original.user_type)}>
                {getUserTypeIcon(row.original.user_type)}
                {getUserTypeLabel(row.original.user_type)}
            </Badge>
        ),
    },
    {
        accessorKey: "mobileNo",
        header: "Contact",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.mobileNo}</div>
        ),
    },
    {
        accessorKey: "permanent_address",
        header: "Location",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <div className="text-sm truncate">{row.original.permanent_address}</div>
            </div>
        ),
    },
    {
        accessorKey: "organizations_id",
        header: "Organization",
        cell: ({ row }) => (
            <div className="text-xs font-mono">{row.original.organizations_id || 'N/A'}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <UserDetailsDialog user={row.original} />
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
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]

export function UserDataTable({
    data: initialData,
}: {
    data: UserProfile[]
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
                        placeholder="Search users..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Select
                        value={(table.getColumn("user_type")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("user_type")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="User Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="lgu">LGU</SelectItem>
                            <SelectItem value="blgu">BLGU</SelectItem>
                            <SelectItem value="bystander">Bystander</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
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
                    <Button variant="default" size="sm">
                        <IconUser className="size-4" />
                        Add User
                    </Button>
                </div>
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
                                    No users found.
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
