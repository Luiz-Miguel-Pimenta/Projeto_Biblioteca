import { Outlet } from "react-router"
import { Header } from "./Header"

export function AppLayout() {
    return (
        <div className="w-screen h-screen flex flex-col items-center bg-slate-50 overflow-hidden">
            
            <div className="w-full px-8 bg-white shadow-sm z-10">
                <Header />
            </div>

            <main className="flex-1 w-full max-w-5xl mx-auto p-6 flex flex-col overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}