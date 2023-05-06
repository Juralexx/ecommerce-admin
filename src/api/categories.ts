import axios from "@/axios.config"
import { getUpdatedObjectFields, sortByAlphabetical } from '../functions/utils'
import { Category } from "@/types"

/**
 * Fetch all categories
 */

export async function getCategories(queries?: Record<string, any>) {
    let categories: Category.Options[] = []
    await axios.get('/api/categories', { params: queries })
        .then(res => {
            categories = [...res.data]
        })
        .catch(err => console.log(err))

    const sorted = sortByAlphabetical(categories, 'name')
    return { categories: sorted }
}

/**
 * Fetch single category
 */

export async function getCategory(id: string) {
    let category: Category.Options = Category.defaultProps

    await axios.get(`/api/categories/${id}`)
        .then(res => {
            return category = res.data
        })
        .catch(err => console.log(err))

    return { category }
}

/**
 * Create category
 */

export async function createCategory(datas: Partial<Category.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Category.Options> = {}

    await axios({
        method: 'post',
        url: '/api/categories/create',
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
 * Update category
 */

export async function updateCategory(category: Category.Options, datas: Partial<Category.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Category.Options> = {}

    let datasToUpdate: Partial<Category.Options> = getUpdatedObjectFields(category, datas)

    await axios({
        method: 'put',
        url: `/api/categories/${category._id}/update`,
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
 * Delete category
 */

export async function deleteCategory(category: Category.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/categories/${category._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}