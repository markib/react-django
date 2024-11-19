import useAuth from "./useAuth"
import useAxiosPrivate from "./useAxiosPrivate"

export default function useUser() {

    const { setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()

    async function getUser() {
        try {
            const  response  = await axiosPrivateInstance.get('/auth/profile/')
            setUser({ username: response?.data?.username, isAuthenticated: true })
            // setUser(data)
        } catch (error) {
            console.log(error.response)
        }
    }

    return getUser
}