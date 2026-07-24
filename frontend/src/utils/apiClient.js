const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    constructor(status, message, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

async function request(path, { method = "GET", body, signal, headers } = {}) {
    // FormData (file uploads) must not be JSON-encoded and must let the browser
    // set its own multipart Content-Type/boundary.
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            credentials: "include",
            headers: {
                ...(body !== undefined && !isForm && { "Content-Type": "application/json" }),
                ...headers,
            },
            body: body !== undefined ? (isForm ? body : JSON.stringify(body)) : undefined,
            signal,
        });
    } catch (err) {
        if (err.name === "AbortError") throw err;
        throw new ApiError(0, "خطایی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید.");
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
        // no/invalid JSON body
    }

    if (!res.ok) {
        throw new ApiError(res.status, data?.message || "خطایی رخ داده است.", data);
    }

    return data;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: "GET" }),
    post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
    put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
    patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
    delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
