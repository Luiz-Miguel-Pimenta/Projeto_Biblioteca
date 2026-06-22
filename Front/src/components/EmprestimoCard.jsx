import { Bookmark } from "lucide-react"

export function EmprestimoCard({ emprestimo, onClick }) {
    const coresStatus = {
        ativo: "bg-blue-100 text-blue-700",
        devolvido: "bg-emerald-100 text-emerald-700",
        atrasado: "bg-red-100 text-red-700",
    }

    return (
        <div 
            onClick={onClick}
            className="flex items-center bg-white hover:bg-slate-50 transition ease-in border 
            border-slate-200 rounded-xl cursor-pointer p-2 justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                    <Bookmark size={24} />
                </div>
            </div>
        </div>
    )
}