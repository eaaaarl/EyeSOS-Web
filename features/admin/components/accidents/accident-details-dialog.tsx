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
    IconPhoto,
} from "@tabler/icons-react"
import { getSeverityColor } from '../../helpers/accident-helpers'
import { AccidentReport } from '../../api/interface'
import { useState } from 'react'
import Image from 'next/image'


export function AccidentDetailsDialog({ report }: { report: AccidentReport }) {
    const [imgError, setImgError] = useState(false)
    const [imgLoading, setImgLoading] = useState(true)

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

                    {report.accident_images.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-xs flex items-center gap-1">
                                <IconPhoto className="size-3.5" />
                                Report Image
                            </Label>
                            {!imgError ? (
                                <div className="relative rounded-lg overflow-hidden border bg-muted/40 aspect-video">
                                    {imgLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/40 animate-pulse">
                                            <IconPhoto className="size-8 text-muted-foreground/40" />
                                            <span className="text-xs text-muted-foreground">Loading image...</span>
                                        </div>
                                    )}
                                    <Image
                                        src={report.accident_images[0].url}
                                        alt={`Accident report ${report.report_number}`}
                                        fill
                                        className={`object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                                        onLoad={() => setImgLoading(false)}
                                        onError={() => { setImgLoading(false); setImgError(true) }}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-lg border bg-muted/40 aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <IconPhoto className="size-8 opacity-40" />
                                    <p className="text-xs">Image could not be loaded</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-muted-foreground text-xs">Location Details</Label>

                        <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg border">
                            <IconMapPin className="size-5 mt-0.5 text-red-500 shrink-0" />
                            <div className="space-y-1 w-full">
                                <p className="font-medium text-sm">{report.location_address}</p>
                                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                                    <span className="col-span-2">
                                        {[report.barangay, report.municipality, report.province]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                    {report.landmark && (
                                        <span className="col-span-2 flex items-center gap-1">
                                            <span className="font-medium">Landmark:</span> {report.landmark}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <IconMapPin className="size-3.5" />
                                    <span>Coordinates</span>
                                </div>
                                <div className="font-mono text-xs font-medium">
                                    <div>Lat: {report.latitude?.toFixed(6) ?? "N/A"}</div>
                                    <div>Long: {report.longitude?.toFixed(6) ?? "N/A"}</div>
                                </div>
                            </div>

                            {(report.location_quality || report.location_accuracy) && (
                                <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <IconMapPin className="size-3.5" />
                                        <span>Precision</span>
                                    </div>
                                    <div className="text-xs space-y-0.5">
                                        {report.location_quality && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Quality:</span>
                                                <span className="font-medium">{report.location_quality}</span>
                                            </div>
                                        )}
                                        {report.location_accuracy && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Accuracy:</span>
                                                <span className="font-medium">{report.location_accuracy}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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