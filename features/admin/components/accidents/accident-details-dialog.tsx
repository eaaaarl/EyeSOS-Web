import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    IconEye,
    IconMapPin,
    IconPhone,
    IconUser,
} from "@tabler/icons-react"
import { getSeverityColor } from '../../helpers/accident-helpers'
import { AccidentReport } from '../../api/interface'


export function AccidentDetailsDialog({ report }: { report: AccidentReport }) {
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
                        Accident Report: {report.report_number}
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
                        {/*  <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Status</Label>
                            <Badge className={getStatusColor(report)}>
                                {report.status}
                            </Badge>
                        </div> */}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Location</Label>
                        <div className="flex items-start gap-2">
                            <IconMapPin className="size-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{report.location_address}</p>
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
                                <span className="font-medium">{report.reporter_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconPhone className="size-4 text-muted-foreground" />
                                <span className="text-sm">{report.reporter_contact}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">Notes</Label>
                        <p className="text-sm bg-muted p-3 rounded-md">
                            {report.reporter_notes}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Response Time</Label>
                            <p className="font-medium">{report.created_at}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs">Reported At</Label>
                            <p className="text-sm">
                                {new Date(report.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
