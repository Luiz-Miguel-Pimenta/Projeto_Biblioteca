import { useState } from "react";
import { X, CheckCircle2, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { api } from "../services/api";

export function ModalVisualizarEmprestimo({ emprestimo, onClose, onConfirm }) {
  const [carregando, setCarregando] = useState(false);

  if (!emprestimo) return null;

  async function handleDevolucao() {
    setCarregando(true);
    try {
      await api.patch(`/emprestimo/${emprestimo.id}/devolucao`);

      alert("Devolução registrada com sucesso!");
      onConfirm(); 
      onClose(); 
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return alert(
          error.response?.data?.message || "Erro ao registrar devolução.",
        );
      }
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCancelarEmprestimo() {
    const confirmar = window.confirm(
      `Tem certeza que deseja cancelar o empréstimo #${emprestimo.id}? Esta ação não pode ser desfeita.`,
    );
    if (!confirmar) return;

    setCarregando(true);
    try {
      await api.delete(`/emprestimo/${emprestimo.id}`);

      alert("Empréstimo cancelado e excluído com sucesso!");
      onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return alert(
          error.response?.data?.message || "Erro ao cancelar empréstimo.",
        );
      }
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Gerenciar Empréstimo
          </h2>
          <button
            onClick={onClose}
            disabled={carregando}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm text-slate-600 space-y-1.5 border border-slate-100">
          <p>
            <strong>ID do Registro:</strong> #{emprestimo.id}
          </p>
          <p>
            <strong>Livro:</strong> {emprestimo.livro_titulo}
          </p>
          <p>
            <strong>Leitor:</strong>{" "}
            {emprestimo.leitor_name ||
              emprestimo.leitor_nome ||
              "Não informado"}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <strong>Status Atual:</strong>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                            ${emprestimo.status === "devolvido" ? "bg-emerald-100 text-emerald-700" : ""}
                            ${emprestimo.status === "ativo" ? "bg-blue-100 text-blue-700" : ""}
                            ${emprestimo.status === "atrasado" ? "bg-red-100 text-red-700" : ""}
                        `}
            >
              {emprestimo.status}
            </span>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Ações Disponíveis:
        </p>

        <div className="flex flex-col gap-3">
          <button
            disabled={carregando || emprestimo.status === "devolvido"}
            onClick={handleDevolucao}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>
                {emprestimo.status === "devolvido"
                  ? "Já Devolvido"
                  : "Registrar Devolução"}
              </span>
            </div>
            <span className="text-xs font-normal text-emerald-600">
              Devolve estoque (+1)
            </span>
          </button>

          <button
            disabled={carregando}
            onClick={handleCancelarEmprestimo}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Trash2 size={18} />
              <span>Cancelar Empréstimo</span>
            </div>
            <span className="text-xs font-normal text-red-600">
              Excluir do sistema
            </span>
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={carregando}
          className="mt-5 w-full text-center py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          Voltar para a lista
        </button>
      </div>
    </div>
  );
}
