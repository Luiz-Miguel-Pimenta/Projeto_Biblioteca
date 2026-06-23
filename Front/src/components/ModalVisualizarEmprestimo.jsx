import { useState } from "react";
import { Undo2, CheckCircle2, Trash2 } from "lucide-react";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Button } from "./Button";

export function ModalVisualizarEmprestimo({ emprestimo, onClose, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const { sessao } = useAuth();

    const coresStatus = {
        ativo: "bg-blue-100 text-blue-700",
        devolvido: "bg-emerald-100 text-emerald-700",
        atrasado: "bg-red-100 text-red-700",
    };

    if (!emprestimo) return null;

    async function RegistrarDevolucao() {
        const confirmar = window.confirm(
            `Tem certeza que deseja registrar a devolução do empréstimo #${emprestimo.id}?`,
        );

        if (!confirmar) return;

        setIsLoading(true);

        try {
            await api.patch(`/emprestimo/${emprestimo.id}/devolucao`);

            alert("Devolução registrada com sucesso!");

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError) {
                return alert(error.response?.data?.message || "Erro ao registrar devolução.");
            }

            alert("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    }

    async function CancelarEmprestimo() {
        const confirmar = window.confirm(
            `Tem certeza que deseja cancelar o empréstimo #${emprestimo.id}? Esta ação não pode ser desfeita.`,
        );

        if (!confirmar) return;

        setIsLoading(true);

        try {
            await api.delete(`/emprestimo/${emprestimo.id}`);

            alert("Empréstimo cancelado e excluído com sucesso!");

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError) {
                return alert(error.response?.data?.message || "Erro ao cancelar empréstimo.",);
            }

            alert("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    }

    const dataVencimento = new Date(emprestimo.data_devolucao_prevista).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    const dataEmprestimo = new Date(emprestimo.data_emprestimo).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">
                        {sessao?.usuario?.perfil === "bibliotecario" 
                            ? "Gerenciar Empréstimo" 
                            : "Detalhes do Empréstimo"
                        }
                    </h2>
                    <Button onClick={onClose} isLoading={isLoading} tema="fantasma" tamanho="icon">
                        <Undo2 size={24} />
                    </Button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm text-slate-600 space-y-1.5 border border-slate-300">
                    <p>
                        <strong>ID do Empréstimo:</strong> #{emprestimo.id}
                    </p>
                    <p>
                        <strong>Livro:</strong> {emprestimo.livro_titulo}
                    </p>
                    {sessao?.usuario?.perfil === "bibliotecario" && (
                        <p>
                            <strong>Leitor: </strong>{emprestimo.leitor_nome}
                        </p>
                    )}

                    <p>
                        <strong>Data do Empréstimo:</strong> {dataEmprestimo}
                    </p>
                    <p>
                        <strong>Data de Vencimento:</strong> {dataVencimento}
                    </p>
                    
                    <div className="pt-2 mt-2 border-t border-slate-200 flex items-center gap-2">
                        <strong>Status Atual:</strong>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                ${coresStatus[emprestimo.status]}
                            `}
                        >
                            {emprestimo.status}
                        </span>
                    </div>
                </div>

                {sessao?.usuario?.perfil === "bibliotecario" && (
                    <>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Ações Disponíveis:
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                disabled={isLoading || emprestimo.status === "devolvido"}
                                onClick={RegistrarDevolucao}
                                className="w-full flex items-center justify-between p-3 rounded-xl 
                                border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 
                                font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={20} />
                                    <span>
                                        {emprestimo.status === "devolvido"
                                            ? "Já Devolvido"
                                            : "Registrar Devolução"
                                        }
                                    </span>
                                </div>

                                <span className="text-xs font-normal text-emerald-600">
                                    Devolve estoque (+1)
                                </span>
                            </button>

                            <button
                                disabled={isLoading}
                                onClick={CancelarEmprestimo}
                                className="w-full flex items-center justify-between p-3 rounded-xl 
                                border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 
                                font-semibold disabled:opacity-50"
                            >

                                <div className="flex items-center gap-2">
                                    <Trash2 size={20} />
                                    <span>Cancelar Empréstimo</span>
                                </div>

                                <span className="text-xs font-normal text-red-600">
                                    Excluir do sistema
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
