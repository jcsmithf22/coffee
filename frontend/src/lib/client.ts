import { hc } from "hono/client"
import type { App } from "opencontrol"

const ENDPOINT = import.meta.env.DEV
    ? "http://localhost:4000"
    : import.meta.env.VITE_OPENCONTROL_ENDPOINT

// export const client = hc<App>(ENDPOINT || "", {
//     async fetch(...args: Parameters<typeof fetch>): Promise<Response> {
//         const [input, init] = args
//         const request = input instanceof Request ? input : new Request(input, init)
//         const headers = new Headers(request.headers)
//         headers.set("authorization", `Bearer ${password()}`)
//         return fetch(
//             new Request(request, {
//                 ...init,
//                 headers,
//             }),
//         )
//     },
// })

export const createClient = (password: string) => {
    // @ts-ignore
    return hc<App>(ENDPOINT || "", {
        headers: {
            Authorization: `Bearer ${password}`,
        }
    })
}