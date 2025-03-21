export const getUsers = async () => {
    const response = await fetch("/api/cache/users")
    const data = await response.json()
    return data
}

export const getMessages = async () => {
    const response = await fetch("/api/cache/messages")
    const data = await response.json()
    return data
}