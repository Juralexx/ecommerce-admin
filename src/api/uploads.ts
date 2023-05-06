import axios from '@/axios.config'

export const uploadImage = async (file: any) => {
    let errors = { error: '', message: '' }
    let data = {}

    const fileSizeInMB = file.size / 1024 / 1024

    if (fileSizeInMB > 2) {
        errors = { error: 'maxSize', message: 'Certains fichiers n\'ont pu être transferer car il sont trop lourd' }
    }

    if (!errors.message) {
        let formData = new FormData()
        formData.append("file", file)

        await axios
            .post(`/api/medias/upload/single`, formData)
            .then(res => {
                if (res.data.errors) {
                    errors = {
                        error: Object.keys(res.data.errors)[0],
                        message: Object.values(res.data.errors)[0] as string
                    }
                }
                data = res.data
            })
            .catch(err => {
                if (err.response) {
                    errors = {
                        error: Object.keys(err.response.data.errors)[0],
                        message: Object.values(err.response.data.errors)[0] as string
                    }
                }
            })
    }

    return { errors, data }
}

/**
 * Upload multiple medias
 */

export const uploadImages = async (files: any) => {
    let errors = { error: '', message: '' }
    let data: any[] = []

    if (files) {
        for (let i = files.length - 1; i >= 0; i--) {
            const fileSizeInMB = files[i].size / 1024 / 1024
            if (fileSizeInMB > 2) {
                files.splice(i, 1)
                errors = { error: 'maxSize', message: 'Certains fichiers n\'ont pu être transferer car il sont trop lourd' }
            }
        }
    }

    if (files.length > 0) {
        let formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i])
        }

        await axios
            .post(`/api/medias/upload/multiple`, formData)
            .then(res => {
                if (res.data.errors) {
                    errors = {
                        error: Object.keys(res.data.errors)[0],
                        message: Object.values(res.data.errors)[0] as string
                    }
                }
                data = res.data
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                    errors = {
                        error: Object.keys(err.response.data.errors)[0],
                        message: Object.values(err.response.data.errors)[0] as string
                    }
                }
            })
    }

    return { errors, data }
}

/**
 * Fetch all categories
 */

export async function getMedias() {
    let medias: any[] = []
    await axios.get(`/api/medias`)
        .then(res => {
            medias = [...res.data]
        })
        .catch(err => console.log(err))

    return { medias }
}

/**
 * Fetch single category
 */

export async function getMedia(id: string) {
    let media = {}
    await axios.get(`/api/medias/${id}`)
        .then(res => {
            return media = res.data
        })
        .catch(err => console.log(err))

    return { media }
}

/**
 * Replace a file by another
 */

export async function updateMedia(id: string, fileToUpload: any, fileToDelete: string) {
    let formData = new FormData()
    formData.append("fileToUpdate", fileToDelete.replace('/uploads/', ''))
    formData.append("file", fileToUpload)

    let errors = { error: '', message: '' }
    let data = {}

    await axios.put(`/api/medias/${id}/update`, formData)
        .then(res => {
            if (res.data.errors) {
                errors = {
                    error: Object.keys(res.data.errors)[0],
                    message: Object.values(res.data.errors)[0] as string
                }
            }
            data = res.data
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

export async function deleteMedia(file: any) {
    let errors = { error: '', message: '' }

    await axios({
        method: 'delete',
        url: `/api/medias/${file._id}/delete`,
        data: {
            filename: file.path.replace('/uploads/', '')
        }
    })
        .then(res => {
            if (res.data.errors) {
                return errors = { error: Object.keys(res.data.errors)[0], message: Object.values(res.data.errors)[0] as string }
            }
        })
        .catch(err => console.log(err))

    return { errors }
}