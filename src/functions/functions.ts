import { diffBetweenDates } from "./utils"

export const isAdmin = (role: string) => {
    const roles = ['admin', 'developer']
    return roles.includes(role)
}

export const isNotUser = (role: string) => {
    const roles = ['admin', 'developer', 'editor']
    return roles.includes(role)
}

export const encodeRole = (role: string) => {
    switch (role) {
        case 'Utilisateur':
            return 'user'
        case 'Administrateur':
            return 'admin'
        case 'Éditeur':
            return 'editor'
        case 'Développeur':
            return 'developer'
        default:
            return 'user'
    }
}

export const decodeRole = (role: string) => {
    switch (role) {
        case 'user':
            return 'Utilisateur'
        case 'admin':
            return 'Administrateur'
        case 'editor':
            return 'Éditeur'
        case 'developer':
            return 'Développeur'
        default:
            return 'Utilisateur'
    }
}

export const getStatusColor = (status: string) => {
    switch (status) {
        //orders status
        case 'accepted':
            return 'success'
        case 'preparation':
            return 'warning'
        case 'completed':
            return 'success'
        case 'shipped':
            return 'info'
        case 'delivered':
            return 'success'

        //payments status
        case 'awaiting':
            return 'warning'
        case 'paid':
            return 'success'
        case 'canceled':
            return 'danger'
        default:
            return 'Utilisateur'
    }
}

export function getDateStatus(start: string | Date, end: string | Date) {
    const now = new Date()
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (now < startDate)
        return `Débute dans ${diffBetweenDates(now, start)} jours`
    if (now > endDate)
        return `Terminé depuis ${diffBetweenDates(end, now)} jours`
    if (now > startDate && now < endDate)
        return `Début : ${diffBetweenDates(start, now)} jours - Fin : ${diffBetweenDates(now, end)} jours`
}