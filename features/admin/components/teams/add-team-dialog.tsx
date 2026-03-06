"use client"

import * as React from "react"
import { IconPlus, IconUsers } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function AddTeamDialog() {
    const [open, setOpen] = React.useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock submission logic
        console.log("Team added")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="gap-2">
                    <IconPlus className="size-4" />
                    <span>Add Team</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconUsers className="size-5 text-primary" />
                            Create New Team
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new emergency response team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Alpha Response Unit"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="leader">Team Leader</Label>
                            <Select required>
                                <SelectTrigger id="leader">
                                    <SelectValue placeholder="Select a leader" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">John Doe (LGU)</SelectItem>
                                    <SelectItem value="2">Jane Smith (LGU)</SelectItem>
                                    <SelectItem value="3">Robert Brown (BLGU)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the team's specialization or area."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Team</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
