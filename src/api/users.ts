import axios from "@/axios.config"
import { getUpdatedObjectFields, sortByAlphabetical } from '../functions/utils'
import { User } from "@/types"

/**
 * Fetch all users
 */

export async function getUsers() {
    let users: User.Options[] = []
    await axios.get(`/api/users`)
        .then(res => {
            users = [...res.data]
        })
        .catch(err => console.log(err))

    const sorted = sortByAlphabetical(users, 'name')
    return { users: sorted }
}

/**
 * Fetch single user
 */

export async function getUser(id: string) {
    let user = {}
    await axios.get(`/api/users/${id}`)
        .then(res => {
            return user = res.data
        })
        .catch(err => console.log(err))

    return { user }
}

/**
 * Create user
 */

export async function createUser(datas: Partial<User.Options>) {
    let errors = { error: '', message: '' }
    let data = {}

    await axios({
        method: 'post',
        url: `/api/users/register`,
        data: datas
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            } else {
                data = res.data
            }
        })
        .catch(err => {
            if (err.response) {
                errors = {
                    error: Object.keys(err.response.data.errors)[0],
                    message: Object.values(err.response.data.errors)[0] as string
                }
            }
        })

    return { errors, data }
}

/**
 * Update user
 */

export async function updateUser(user: User.Options, datas: Partial<User.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<User.Options> = {}

    let datasToUpdate: Partial<User.Options> = getUpdatedObjectFields(user, datas)

    await axios({
        method: 'put',
        url: `/api/users/${user._id}/update`,
        data: datasToUpdate
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            } else {
                data = res.data
            }
        })
        .catch(err => {
            if (err.response) {
                errors = {
                    error: Object.keys(err.response.data.errors)[0],
                    message: Object.values(err.response.data.errors)[0] as string
                }
            }
        })

    return { errors, data }
}

/**
 * Delete user
 */

export async function deleteUser(user: User.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/users/${user._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}