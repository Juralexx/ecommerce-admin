import axios from "@/axios.config"
import { getUpdatedObjectFields, sortByAlphabetical } from '../functions/utils'
import { Customer } from "@/types"

/**
 * Fetch all customers
 */

export async function getCustomers(queries?: Record<string, any>) {
    const response = await axios.get(`/api/customers`, { params: queries })
        .then(res => res.data)
        .catch(err => console.log(err))

    const sorted = sortByAlphabetical(response.documents, 'name')
    return {
        customers: sorted,
        count: response.count,
        currentPage: response.currentPage,
        limit: response.limit
    }
}

/**
 * Fetch single customer
 */

export async function getCustomer(id: string) {
    let customer = {}
    await axios.get(`/api/customers/${id}`)
        .then(res => {
            return customer = res.data
        })
        .catch(err => console.log(err))

    return { customer }
}

/**
 * Create customer
 */

export async function createCustomer(datas: Partial<Customer.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Customer.Options> = {}

    await axios({
        method: 'post',
        url: `/api/customers/register`,
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
 * Update customer
 */

export async function updateCustomer(user: Customer.Options, datas: Partial<Customer.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Customer.Options> = {}

    let datasToUpdate: Partial<Customer.Options> = getUpdatedObjectFields(user, datas)

    await axios({
        method: 'put',
        url: `/api/customers/${user._id}/update`,
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
 * Delete customer
 */

export async function deleteCustomer(user: Customer.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/customers/${user._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}