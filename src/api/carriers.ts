import axios from "@/axios.config"
import { getUpdatedObjectFields } from '../functions/utils'
import { Carrier } from "@/types"

/**
 * Fetch all carriers
 */

export async function getCarriers(queries?: Record<string, any>) {
    let carriers: Carrier.Options[] = []
    await axios.get('/api/carriers', { params: queries })
        .then(res => {
            carriers = [...res.data]
        })
        .catch(err => console.log(err))

    return { carriers }
}

/**
 * Fetch single carrier
 */

export async function getCarrier(id: string) {
    let carrier: Carrier.Options = Carrier.defaultProps

    await axios.get(`/api/carriers/${id}`)
        .then(res => {
            return carrier = res.data
        })
        .catch(err => console.log(err))

    return { carrier }
}

/**
 * Create carrier
 */

export async function createCarrier(datas: Partial<Carrier.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Carrier.Options> = {}

    await axios({
        method: 'post',
        url: '/api/carriers/create',
        data: datas
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
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
 * Update carrier
 */

export async function updateCarrier(carrier: Carrier.Options, datas: Partial<Carrier.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Carrier.Options> = {}

    let datasToUpdate: Partial<Carrier.Options> = getUpdatedObjectFields(carrier, datas)

    console.log(datasToUpdate);

    await axios({
        method: 'put',
        url: `/api/carriers/${carrier._id}/update`,
        data: datasToUpdate
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
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
 * publish carrier
 */

export async function publish(carrier: Carrier.Options, alert: any, redirection: () => void) {
    const { errors } = await updateCarrier(carrier, { published: !carrier.published })
    if (errors.message) {
        alert('Une erreur est survenue...', 'error')
    } else {
        alert(carrier.published ? 'Le transporteur a été retiré de la liste des transporteurs.' : 'Le transporteur a été ajouté à la liste des transporteurs.', 'success')
        redirection()
    }
}

/**
 * Delete carrier
 */

export async function deleteCarrier(carrier: Carrier.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/carriers/${carrier._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}