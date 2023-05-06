import axios from "@/axios.config"
import { getUpdatedObjectFields, sortByAlphabetical } from '../functions/utils'
import { Product } from "@/types"

/**
 * Fetch all products
 */

export async function getProducts(queries?: Record<string, any>) {
    const response = await axios.get('/api/products', { params: queries })
        .then(res => res.data)
        .catch(err => console.log(err))

    const sorted = sortByAlphabetical(response.documents, 'name')
    return {
        products: sorted,
        count: response.count,
        currentPage: response.currentPage,
        limit: response.limit
    }
}

/**
 * Fetch single product
 */

export async function getProduct(id: string) {
    let product: Partial<Product.Options> = {}
    await axios.get(`/api/products/${id}`)
        .then(res => {
            return product = res.data
        })
        .catch(err => console.log(err))

    return { product }
}

/**
 * Create product
 */

export async function createProduct(datas: Partial<Product.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Product.Options> = {}

    await axios({
        method: 'post',
        url: `/api/products/create`,
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
 * Update product
 */

export async function updateProduct(product: Product.Options, datas: Partial<Product.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Product.Options> = {}

    let datasToUpdate: Partial<Product.Options> = getUpdatedObjectFields(product, datas)

    await axios({
        method: 'put',
        url: `/api/products/${product._id}/update`,
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
 * publish product
 */

export async function publish(product: Product.Options, alert: any, redirection: () => void) {
    const { errors } = await updateProduct(product, { published: !product.published })
    if (errors.message) {
        alert('Une erreur est survenue...', 'error')
    } else {
        alert(product.published ? 'Produit dépubliée !' : 'Produit publiée !', 'success')
        redirection()
    }
}

/**
 * Delete product
 */

export async function deleteProduct(product: Product.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/products/${product._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}