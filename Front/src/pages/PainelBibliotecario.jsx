import { FormularioLivro } from "../components/FormularioLivro";

export function PainelBibliotecario() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Gestão da Biblioteca
            </h1>

            
            <div className="max-w-md">
                <FormularioLivro />
            </div>
        </div>
    );
}