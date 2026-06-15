import { Outlet } from "react-router"
import { BookOpen } from "lucide-react";

export function AuthLayout() {
    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-slate-200 p-8">

            <main className="flex flex-col w-full rounded-xl bg-white p-6 shadow-md border-slate-200 max-w-md">
                
                <div className="flex items-center gap-1 justify-center mb-2">
                    <BookOpen size={25} className="text-blue-600" />
                    <h1 className="text-blue-600 text-xl">Biblioteca</h1>
                </div>
   
                <Outlet />
            </main>

        </div>
    )
}