import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from "react"
import ToastContainer from "./ToastContainer"

interface Toast {
    id: number
    type: "success" | "error"
    message: string
}

interface ToastContextValue {
    showSuccess: (message: string, duration?: number) => void
    showError: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback(
        ({ type = "success", message, duration = 3000 }: { type?: "success" | "error"; message: string; duration?: number }) => {
            if (!message) return

            const id = Date.now() + Math.random()
            const toast = { id, type, message }

            setToasts((prev) => [...prev, toast])

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration)
            }
        },
        [removeToast]
    )

    const contextValue = {
        showSuccess: (message: string, duration?: number) =>
            showToast({ type: "success", message, duration }),
        showError: (message: string, duration?: number) =>
            showToast({ type: "error", message, duration }),
    }

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return ctx
}