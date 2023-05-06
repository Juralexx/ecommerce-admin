import axios from "@/axios.config"
import { getUpdatedObjectFields, sortByAlphabetical } from '../functions/utils'
import { Page } from "@/types"

/**
 * Fetch all pages
 */

export async function getPages() {
    let pages: Page.Options[] = []
    await axios.get(`/api/pages`)
        .then(res => {
            pages = [...res.data]
        })
        .catch(err => console.log(err))

    const sorted = sortByAlphabetical(pages, 'title')
    return { pages: sorted }
}

/**
 * Fetch single page
 */

export async function getPage(id: string) {
    let page: Partial<Page.Options> = {}
    await axios.get(`/api/pages/${id}`)
        .then(res => {
            return page = res.data
        })
        .catch(err => console.log(err))

    return { page }
}

/**
 * Create page
 */

export async function createPage(datas: Partial<Page.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Page.Options> = {}

    await axios({
        method: 'post',
        url: `/api/pages/create`,
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
 * Update page
 */

export async function updatePage(page: Page.Options, datas: Partial<Page.Options>) {
    let errors = { error: '', message: '' }
    let data: Partial<Page.Options> = {}

    let datasToUpdate: Partial<Page.Options> = getUpdatedObjectFields(page, datas)

    await axios({
        method: 'put',
        url: `/api/pages/${page._id}/update`,
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
 * publish function
 */

export async function publish(page: Page.Options, alert: any, redirection: () => void) {
    const { errors } = await updatePage(page, { published: !page.published })
    if (errors.message) {
        alert('Une erreur est survenue...', 'error')
    } else {
        alert(page.published ? 'Page dépubliée !' : 'Page publiée !', 'success')
        redirection()
    }
}

/**
 * Delete page
 */

export async function deletePage(page: Page.Options) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/pages/${page._id}/delete`
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}