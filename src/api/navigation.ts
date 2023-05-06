import axios from "@/axios.config"

/**
 * Fetch navigation
 */

export async function getNavigation() {
    let navigation: any[] = []
    await axios.get(`/api/navigation`)
        .then(res => {
            return navigation = res.data
        })
        .catch(err => console.log(err))

    return { navigation }
}

/**
 * Update navigation
 */

export async function updateNavigation(datas: any) {
    let errors = { error: '', message: '' }
    let data = {}

    await axios({
        method: 'put',
        url: `/api/navigation/update`,
        data: {
            navigation: datas
        }
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