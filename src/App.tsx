import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "./components/ToastContext"
import { AuthProvider } from "./contexts/AuthContext"
import InvitationPage from "./pages/InvitationPage"

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/promo-toki-mobile-referral" element={<InvitationPage />} />
                        <Route path="/promo-lunar-ny2025-pre" element={<InvitationPage />} />
                        <Route path="/" element={<InvitationPage />} />
                    </Routes>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    )
}

export default App