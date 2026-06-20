import { useState } from "react"; 
import { FormularioLivro } from "../components/FormularioLivro";
import { ModalEditarLivro } from "../components/ModalEditarLivro"; 

export function PainelBibliotecario() {
    
    const [livroEditandoId, setLivroEditandoId] = useState(null);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Gestão da Biblioteca
            </h1>

            
            <button 
                onClick={() => setLivroEditandoId(2)}//ID TESTE PARA EDITAR 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-8 font-bold"
            >
                Testar Editar
            </button>


            <div className="max-w-md">
                <FormularioLivro />
            </div>

            {livroEditandoId && (
                <ModalEditarLivro 
                    idLivro={livroEditandoId} 
                    onClose={() => setLivroEditandoId(null)} 
                />
            )}
        </div>
    );
}