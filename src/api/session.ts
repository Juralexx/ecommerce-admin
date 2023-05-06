import axios from "@/axios.config"
import { IncomingMessage, ServerResponse } from "http"
import { User } from "@/types"

export async function getSession(req: IncomingMessage) {
    let uid = null

    await axios({
        method: "get",
        url: `/jwtid`,
        withCredentials: true,
        headers: {
            Cookie: req.headers.cookie
        }
    })
        .then((res) => {
            if (res) {
                uid = res.data
            }
        })
        .catch(err => console.log(err))
    return { uid }
}

export async function getUser(id: string | null) {
    let user = null

    if (id) {
        await axios({
            method: "get",
            url: `/api/users/${id}`
        })
            .then(res => {
                if (res.data) {
                    user = res.data
                }
            })
            .catch(err => console.log(err))
    }

    return { user }
}

export async function isAuthenticated(req: IncomingMessage, res: ServerResponse) {
    const { uid } = await getSession(req)
    const { user } = await getUser(uid)

    if (user) {
        return user as User.Entity
    } else {
        if (req.url !== '/login') {
            res.writeHead(301, { location: '/login' });
            res.end();
        }
    }
}