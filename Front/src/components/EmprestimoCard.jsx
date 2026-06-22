import { Bookmark } from "lucide-react";

export function EmprestimoCard({ emprestimo, onClick }) {
    const coresStatus = {
        ativo: "bg-blue-100 text-blue-700",
        devolvido: "bg-emerald-100 text-emerald-700",
        atrasado: "bg-red-100 text-red-700",
        default: "bg-slate-100 text-slate-700"
    };

    const statusColor = coresStatus[emprestimo?.status?.toLowerCase()] || coresStatus.default;

    return (
        <div 
            onClick={onClick}
            className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-4 overflow-hidden">

                <div className="shrink-0 w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                    <Bookmark size={20} />
                </div>
                
                <div className="flex flex-col truncate">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">
                        {emprestimo?.livro_titulo || "Livro não informado"}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                        {emprestimo?.leitor_nome || "Leitor não informado"}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusColor}`}>
                    {emprestimo?.status || "Indefinido"}
                </span>
                
                <span className="text-xs text-slate-400 font-medium">
                    ID: #{emprestimo?.id}
                </span>
            </div>
        </div>
    );
}