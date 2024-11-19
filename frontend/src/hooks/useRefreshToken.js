import { axiosInstance } from "../axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        try {
        const response = await axiosInstance.post('/auth/token/refresh/')
        console.log("response in useRefresh",response.data)
        setAccessToken(response.data.access)
        setCSRFToken(response.headers["x-csrftoken"])

        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
        } catch (error) {

            console.error('Error refreshing token:', error.response ? error.response.data : error.message);

            throw error; // Rethrow the error if you want to handle it elsewhere

        }
    }

    return refresh
}