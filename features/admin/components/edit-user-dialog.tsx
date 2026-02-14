"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"
import { UserProfile } from "../api/interface"
import { useUpdateUserMutation } from "../api/adminApi"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    mobileNo: z.string().min(11, {
        message: "Mobile number must be at least 11 digits.",
    }).optional().or(z.literal("")),
    user_type: z.enum(["admin", "lgu", "blgu", "bystander"]).optional(),
    bio: z.string().optional().or(z.literal("")),
    permanent_address: z.string().optional().or(z.literal("")),
})

export type UserFormValues = z.infer<typeof userFormSchema>

interface EditUserDialogProps {
    user: UserProfile
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export function EditUserDialog({ user, isOpen, onOpenChange, children }: EditUserDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isControlled = typeof isOpen !== 'undefined'
    const open = isControlled ? isOpen : internalOpen
    const setOpen = isControlled ? onOpenChange : setInternalOpen

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            mobileNo: user.mobileNo || "",
            bio: user.bio || "",
            permanent_address: user.permanent_address || "",
        },
    })

    const [updateUser, { isLoading }] = useUpdateUserMutation()

    async function onSubmit(data: UserFormValues) {
        try {
            await updateUser({
                id: user.id,
                payload: data
            }).unwrap()
            toast.success("User updated successfully.")
            setOpen?.(false)
        } catch (error) {
            console.error('UPDATE USER ERROR', error)
            toast.error("Failed to update user.")
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                onInteractOutside={(e) => {
                    e.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle>Edit User Profile</DialogTitle>
                    <DialogDescription>
                        Update user information and account settings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="mobileNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+63 900 000 0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="permanent_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permanent Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter complete address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional information about the user"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen?.(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}