import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const Auth = createContext()
const initialState = { isAuth: false, user: {}, isAdmin: false }

const AuthContext = ({ children }) => {
    const [state, setState] = useState(initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const readProfile = (token) => {
        const jwt = token || localStorage.getItem("jwt")

        if (!jwt) {
            setState(initialState)
            setIsAppLoading(false)
            return
        }

        axios.get("http://localhost:8000/api/user", {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then((res) => {
                const { status, data } = res
                if (status === 200 && data.user) {
                    setState({
                        isAuth: true,
                        user: data.user,
                        isAdmin: data.user.role === "admin"
                    })
                } else {
                    setState(initialState)
                }
            })
            .catch(error => {
                console.error("Auth profile error:", error)
                localStorage.removeItem("jwt")
                setState(initialState)
            })
            .finally(() => {
                setIsAppLoading(false)
            })
    }

    useEffect(() => {
        readProfile()
    }, [])

    const handleLoginSuccess = (token, user) => {
        localStorage.setItem("jwt", token)
        setState({
            isAuth: true,
            user: user,
            isAdmin: user?.role === "admin"
        })
    }

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        setState(initialState)
        if (window.toastify) {
            window.toastify("Logged out successfully", "info")
        }
    }

    return (
        <Auth.Provider
            value={{
                ...state,
                isAppLoading,
                handleLogout,
                handleLoginSuccess,
                dispatch: setState,
                readProfile
            }}
        >
            {children}
        </Auth.Provider>
    )
}

export default AuthContext
export const useAuth = () => useContext(Auth)