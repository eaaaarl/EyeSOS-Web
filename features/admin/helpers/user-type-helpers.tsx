
import {
    IconShieldCheck,
    IconBuilding,
    IconUsers,
    IconEye,
    IconUser,
} from "@tabler/icons-react"

export function getUserTypeColor(userType: string) {
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

export function getUserTypeIcon(userType: string) {
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

export function getUserTypeLabel(userType: string) {
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
