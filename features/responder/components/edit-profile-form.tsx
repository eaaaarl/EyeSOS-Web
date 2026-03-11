"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUserProfileMutation } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, User, Phone, Mail } from "lucide-react";
import { Profile } from "@/features/auth/api/interface";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobileNo: z.string().min(10, "Mobile number must be at least 10 characters"),
});

interface EditProfileFormProps {
    profile: Profile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
    const router = useRouter();
    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile.name || "",
            mobileNo: profile.mobileNo || "",
        },
    });

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            const res = await updateProfile({
                user_id: profile.id,
                updates: values,
            }).unwrap();

            if (res.success) {
                toast.success("Profile updated successfully");
                router.back();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Edit Profile</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-red-600" />
                                    Full Name
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-red-600" />
                                    Mobile Number
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your mobile number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2 opacity-50">
                            <Mail className="w-4 h-4 text-red-600" />
                            Email Address (Read-only)
                        </FormLabel>
                        <Input value={profile.email} disabled className="bg-muted/50" />
                        <p className="text-[10px] text-muted-foreground italic">
                            Email cannot be changed here. Please contact admin for email updates.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold text-base shadow-lg shadow-red-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : null}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
