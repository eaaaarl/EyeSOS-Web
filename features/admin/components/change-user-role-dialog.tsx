"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserProfile, UserType } from "../api/interface"
import { useUpdateUserMutation } from "../api/adminApi"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { UserFormValues } from "./edit-user-dialog"

const roleFormSchema = z.object({
    user_type: z.enum(["admin", "lgu", "blgu", "bystander"], {
        message: "Please select a role.",
    }),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

interface ChangeUserRoleDialogProps {
    user: UserProfile
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    children?: React.ReactNode
}

export function ChangeUserRoleDialog({ user, isOpen, onOpenChange, children }: ChangeUserRoleDialogProps) {
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            user_type: user.user_type,
        },
    })

    async function onSubmit(data: RoleFormValues) {
        try {
            const payload: UserFormValues = {
                name: user.name,
                email: user.email,
                mobileNo: user.mobileNo || "",
                bio: user.bio || "",
                permanent_address: user.permanent_address || "",
                user_type: data.user_type as UserType
            }

            await updateUser({
                id: user.id,
                payload: payload
            }).unwrap()

            toast.success(`User role updated to ${data.user_type.toUpperCase()}.`)
            onOpenChange(false)
        } catch (error) {
            console.error('UPDATE ROLE ERROR', error)
            toast.error("Failed to update user role.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Change User Role</DialogTitle>
                    <DialogDescription>
                        Select a new role for <span className="font-medium text-foreground">{user.name}</span>.
                        This will affect their permissions and access in the system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="user_type"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin" className="cursor-pointer">
                                                <div className="flex flex-col items-start py-1">
                                                    <span className="font-medium">Admin</span>
                                                    <span className="text-xs text-muted-foreground">Full system access and permissions</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="lgu" className="cursor-pointer">
                                                <div className="flex flex-col items-start py-1">
                                                    <span className="font-medium">LGU Official</span>
                                                    <span className="text-xs text-muted-foreground">Local government unit official</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="blgu" className="cursor-pointer">
                                                <div className="flex flex-col items-start py-1">
                                                    <span className="font-medium">BLGU Official</span>
                                                    <span className="text-xs text-muted-foreground">Barangay local government unit official</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="bystander" className="cursor-pointer">
                                                <div className="flex flex-col items-start py-1">
                                                    <span className="font-medium">Bystander</span>
                                                    <span className="text-xs text-muted-foreground">General user with limited access</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}