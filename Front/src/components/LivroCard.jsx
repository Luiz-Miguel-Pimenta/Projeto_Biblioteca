import { BookMarked } from "lucide-react"

export function LivroCard({ livro, onClick, children }) {
    return (
        <div 
            onClick={onClick}
            className="flex items-center bg-white hover:bg-slate-200 transition ease-in border 
            border-slate-300 rounded-lg cursor-pointer p-2 justify-between"
        >
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <BookMarked size={30} />
                </div>

                <div className="flex flex-col ">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">
                        {livro.titulo}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {livro.autor}
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex gap-1 justify-between items-center text-sm font-medium">
                    <span className="text-slate-500">Estoque:</span>
                    <span className={livro.quantidade_disponivel > 0 ? "text-emerald-600" : "text-red-500"}>
                        {livro.quantidade_disponivel > 0 ? `${livro.quantidade_disponivel} disponíveis` : "Esgotado"}
                    </span>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>
    )
}