import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext()

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState("")

    
}