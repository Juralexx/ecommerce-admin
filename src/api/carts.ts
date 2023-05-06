import axios from "@/axios.config"
import { getUpdatedObjectFields } from '../functions/utils'

/**
 * Fetch all carts
 */

export async function getCarts(queries?: Record<string, any>) {
    let carts: any[] = []
    await axios.get('/api/carts', { params: queries })
        .then(res => {
            carts = [...res.data]
        })
        .catch(err => console.log(err))

    return { carts }
}

/**
 * Fetch single cart
 */

export async function getCart(id: string) {
    let cart: any = {}

    await axios.get(`/api/carts/${id}`)
        .then(res => {
            return cart = res.data
        })
        .catch(err => console.log(err))

    return { cart }
}

/**
 * Create cart
 */

export async function createCart(datas: any) {
    let errors = { error: '', message: '' }
    let data: any = {}

    await axios({
        method: 'post',
        url: '/api/carts/create',
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
 * Update cart
 */

export async function updateCart(cart: any, datas: any) {
    let errors = { error: '', message: '' }
    let data: any = {}

    let datasToUpdate: any = getUpdatedObjectFields(cart, datas)

    await axios({
        method: 'put',
        url: `/api/carts/${cart._id}/update`,
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
 * Delete cart
 */

export async function deleteCart(cart: any) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/carts/${cart._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}