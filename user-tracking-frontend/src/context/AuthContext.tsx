import React,{createContext,useContext,useState,useEffect, ContextType, ReactNode} from 'react'
import { AuthResponse } from '../types'
import { CookieUtils } from '../utilities/cookieUtils'

interface AuthContextType{
    isAuthenticated:boolean;
    username: string|null;
    login:(response:AuthResponse)=>void;
    logout:()=> void;
}

const AuthContext=createContext<AuthContextType|undefined>(undefined)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [username,setUsername]=useState<string|null>(null)

    useEffect(()=>{
      const token=localStorage.getItem('token')
      const storedUserName=localStorage.getItem('username')
      const sessionId = CookieUtils.getSessionId()
      
      if(token && storedUserName && sessionId){
        setIsAuthenticated(true)
        setUsername(storedUserName)
      } else {
        logout()
      }
    },[])
   const login= (response:AuthResponse)=>{
    setIsAuthenticated(true)
    setUsername(response.username)
    CookieUtils.setSessionId(crypto.randomUUID())
   }
   const logout=()=>{
     setIsAuthenticated(false)
     setUsername(null)
     localStorage.removeItem('token')
     localStorage.removeItem('username')
     CookieUtils.removeSessionId()
   }
   return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
        {children}
    </AuthContext.Provider>
);
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

