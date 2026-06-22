import { Bookmark, CalendarClock } from "lucide-react";

export function EmprestimoCard({ emprestimo, onClick }) {
    const coresStatus = {
        ativo: "bg-blue-100 text-blue-700",
        devolvido: "bg-emerald-100 text-emerald-700",
        atrasado: "bg-red-100 text-red-700",
    };

    const colorDiv = coresStatus[emprestimo.status] || "bg-slate-100 text-slate-700";

    const dataFormatada = new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    return (
        <div 
            onClick={onClick}
            className="flex items-center justify-between p-4 bg-white border 
            border-slate-300 rounded-xl hover:bg-slate-200 transition 
            ease-in cursor-pointer"
        >
            <div className="flex items-center gap-4">

                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorDiv}`}>
                    <Bookmark size={28} />
                </div>
                
                <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 ">
                        {emprestimo.livro_titulo || "Livro não informado"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Leitor: {emprestimo.leitor_nome ? emprestimo.leitor_nome : "Leitor não informado"}
                    </p>
                    <div className="flex gap-1 items-center text-xs font-semibold text-slate-400 mt-1">
                        <CalendarClock size={14} />
                        <span>Vencimento: {dataFormatada}</span> 
                    </div>
                </div>
            </div>

            <div className="flex flex-col  items-end gap-1.5">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${colorDiv}`}>
                    {emprestimo.status}
                </span>
                
                <span className="text-xs text-slate-400 font-medium">
                    Empréstimo: #{emprestimo.id}
                </span>
            </div>
        </div>
    );
}