import { BookOpen, Undo2 } from "lucide-react";
import { Button } from "./Button";

export function ModalDetalhesLivro({ livro, onClose }) {

    if (!livro) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-md relative flex flex-col items-center text-center">
                
                <Button onClick={onClose} tema="fantasma" tamanho="icon" className="absolute top-4 right-4">
                    <Undo2 size={24} />
                </Button>

                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <BookOpen size={40} />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                    {livro.titulo}
                </h2>
                
                <p className="text-lg text-slate-600 font-medium mb-6 border-b border-slate-200 pb-4 w-full">
                    por {livro.autor}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full text-left bg-slate-50 p-4 rounded-xl border border-slate-300">
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Ano de Publicação</span>
                        <span className="text-slate-700 font-semibold">{livro.ano_publicacao}</span>
                    </div>
                    
                    <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">ID no livro</span>
                        <span className="text-slate-700 font-semibold">#{livro.id}</span>
                    </div>

                    <div className="col-span-2 mt-2">
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Estoque</span>
                        <span className={`font-bold text-lg ${livro.quantidade_disponivel > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {livro.quantidade_disponivel > 0 ? `${livro.quantidade_disponivel} unidades disponíveis` : "Esgotado no momento"}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}