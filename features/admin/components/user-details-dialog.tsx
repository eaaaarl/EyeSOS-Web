
import {
    IconEye,
    IconMail,
    IconPhone,
    IconCalendar,
    IconMapPin,
    IconUser,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { UserProfile } from "../api/interface"
import { getUserTypeColor, getUserTypeIcon, getUserTypeLabel } from "../helpers/user-type-helpers"

export function UserDetailsDialog({ user }: { user: UserProfile }) {
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
                            {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                            ) : (
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            )}
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

                    {user.birth_date && (
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                            <div className="flex items-center gap-2">
                                <IconCalendar className="size-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {new Date(user.birth_date).toLocaleDateString('en-US', {
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
