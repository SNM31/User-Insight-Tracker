import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthResponse } from '../types'
import { CookieUtils } from '../utilities/cookieUtils'
import api from '../api/axios.config'

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState<string | null>(null)

    useEffect(() => {
        // Check authentication state when app loads
        const storedToken = localStorage.getItem('token')
        const storedUsername = localStorage.getItem('username')
        
        if (storedToken && storedUsername) {
            setIsAuthenticated(true)
            setUsername(storedUsername)
            // Set the token in axios defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        }
    }, [])

    const login = (token: string, username: string) => {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setIsAuthenticated(true)
        setUsername(username)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        delete api.defaults.headers.common['Authorization']
        setIsAuthenticated(false)
        setUsername(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

