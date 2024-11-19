import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useRefreshToken from '../hooks/useRefreshToken'
import Navbar from './Navbar'
import MainLayout from '../layouts/MainLayout'
import { CssBaseline, ThemeProvider, CircularProgress } from '@mui/material'
import theme from '../styles/theme';
import App from '../App'

export default function PersistLogin() {

    
    const refresh = useRefreshToken()
    const { accessToken, setUser } = useAuth()
    
    const [loading, setLoading] = useState(true)
    const axiosPrivateInstance = useAxiosPrivate()

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                await refresh()
                const  response  = await axiosPrivateInstance.get('/auth/profile/')
                setUser({ username: response?.data?.username, isAuthenticated: true })
                // setUser(data)
                
            } catch (error) {
                console.log(error?.response)
            } finally {
                
                isMounted && setLoading(false)
            }
        }

        !accessToken ? verifyUser() : setLoading(false)

        return () => {
            isMounted = false
        }
    }, [accessToken, refresh])

    return (
        loading ? (
            <div style={{
                display: 'grid',
                placeItems: 'center',
                height: '100vh',
            }}>
            <CircularProgress size={24} />
            </div>
        ) : (
            <>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                        <MainLayout>
                            
                            {loading ? "Loading" : <Outlet />}
                       </MainLayout>
                </ThemeProvider>
            </>
        )
    );
}