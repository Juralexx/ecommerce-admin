import axios from "@/axios.config"
import { getUpdatedObjectFields } from '../functions/utils'
import { Order } from "@/types"

/**
 * Fetch all orders
 */

export async function getOrders(queries?: Record<string, any>) {
    let response: any = {}
    await axios.get(`/api/orders`, { params: queries })
        .then(res => {
            response = res.data
        })
        .catch(err => console.log(err))
    return {
        orders: response.documents,
        count: response.count,
        currentPage: response.currentPage,
        limit: response.limit
    }
}

/**
 * Fetch single order
 */

export async function getOrder(id: string) {
    let order: Partial<Order.Options> = {}
    await axios.get(`/api/orders/${id}`)
        .then(res => {
            return order = {
                ...res.data,
                timeline: res.data.timeline.reverse()
            }
        })
        .catch(err => console.log(err))

    return { order }
}

/**
 * Create product
 */

export async function createOrder(datas: Partial<Order.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Order.Options> = {}

    await axios({
        method: 'post',
        url: `/api/orders/create`,
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
 * Update order
 */

export async function updateOrder(order: Order.Options, datas: Partial<Order.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Order.Options> = {}

    let datasToUpdate: Partial<Order.Options> = getUpdatedObjectFields(order, datas)

    await axios({
        method: 'put',
        url: `/api/orders/${order._id}/update`,
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