export function getSeverityColor(severity: string) {
    switch (severity.toLowerCase()) {
        case "critical":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "high":
            return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-700"
        case "moderate":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
        case "minor":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

export function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "active":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-700"
        case "in progress":
            return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700"
        case "resolved":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-700"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}
