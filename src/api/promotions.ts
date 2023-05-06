import axios from "@/axios.config"
import { getUpdatedObjectFields } from '../functions/utils'
import { Promotion } from "@/types"

/**
 * Fetch all promotions
 */

export async function getPromotions(queries?: Record<string, any>) {
    let promotions: Promotion.Options[] = []
    await axios.get('/api/promotions', { params: queries })
        .then(res => {
            promotions = [...res.data]
        })
        .catch(err => console.log(err))
    
    return { promotions }
}

/**
 * Fetch single promotion
 */

export async function getPromotion(id: string) {
    let promotion: Promotion.Options = Promotion.defaultProps

    await axios.get(`/api/promotions/${id}`)
        .then(res => {
            return promotion = res.data
        })
        .catch(err => console.log(err))

    return { promotion }
}

/**
 * Create promotion
 */

export async function createPromotion(datas: Partial<Promotion.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Promotion.Options> = {}

    await axios({
        method: 'post',
        url: '/api/promotions/create',
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
 * Update promotion
 */

export async function updatePromotion(promotion: Promotion.Options, datas: Partial<Promotion.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Promotion.Options> = {}

    let datasToUpdate: Partial<Promotion.Options> = getUpdatedObjectFields(promotion, datas)

    await axios({
        method: 'put',
        url: `/api/promotions/${promotion._id}/update`,
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
 * Activé/désactivé promotion
 */

export async function activate(promotion: Promotion.Options, alert: any, redirection: () => void) {
    const { errors } = await updatePromotion(promotion, { is_active: !promotion.is_active })
    if (errors.message) {
        alert('Une erreur est survenue...', 'error')
    } else {
        alert(promotion.is_active ? 'Code désactivé !' : 'Code activé', 'success')
        redirection()
    }
}

/**
 * Delete promotion
 */

export async function deletePromotion(promotion: Promotion.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/promotions/${promotion._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}