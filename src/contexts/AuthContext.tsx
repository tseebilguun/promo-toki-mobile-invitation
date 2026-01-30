import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

interface AuthContextType {
    jwt: string | null
    setJwt: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType>({
    jwt: null,
    setJwt: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [jwt, setJwt] = useState<string | null>(null)

    return (
        <AuthContext.Provider value={{ jwt, setJwt }}>
            {children}
        </AuthContext.Provider>
    )
}