import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { EmprestimoCard } from "../components/EmprestimoCard";
import { ModalAlterarStatus } from "../components/ModalAlterarStatus.jsx";

export function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [busca, setBusca] = useState("");
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);

  const { sessao } = useAuth();
  const ehBibliotecario = sessao?.usuario?.perfil === "bibliotecario";

  async function carregarEmprestimos() {
    try {
      const response = await api.get(
        ehBibliotecario
          ? "/emprestimo/listar"
          : "/emprestimo/emprestimos-leitor",
      );

      setEmprestimos(response.data);
    } catch (error) {
      console.error(error);
      setEmprestimos([]); 

      if (error instanceof AxiosError) {
        return alert(
          error.response?.data?.message || "Erro ao carregar os dados.",
        );
      }

      alert("Não foi possível carregar a lista de empréstimos.");
    }
  }

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  const emprestimosFiltrados = emprestimos.filter((emprestimo) =>
    String(emprestimo.id).includes(busca),
  );

  return (
    <div className="flex flex-col flex-1 bg-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">

      <div className="flex flex-col items-center gap-4 shrink-0 mb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-slate-800">
            {ehBibliotecario ? "Painel de Empréstimos" : "Meus Empréstimos"}
          </h1>
          <p className="text-slate-500 text-sm text-center">
            {ehBibliotecario
              ? "Gerencie devoluções, consulte o status e o histórico de leitores."
              : "Acompanhe os prazos e o histórico dos seus livros emprestados."}
          </p>
        </div>

        <div className="w-full relative max-w-md">
          <Input
            placeholder="Pesquisar por ID do empréstimo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-slate-400" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
        {emprestimosFiltrados.length === 0 && (
          <p className="text-center text-slate-500 mt-10 bg-white/50 py-8 rounded-xl border border-dashed border-blue-200">
            Nenhum registro de empréstimo encontrado.
          </p>
        )}

        {emprestimosFiltrados.map((emprestimo) => (
          <EmprestimoCard
            key={emprestimo.id}
            emprestimo={emprestimo}
            onClick={() => {
              if (ehBibliotecario) {
                setEmprestimoSelecionado(emprestimo);
              } else {
                alert(
                  `Livro: "${emprestimo.livro_titulo}" - Status atual: ${emprestimo.status.toUpperCase()}`,
                );
              }
            }}
          />
        ))}
      </div>

      <ModalAlterarStatus
        emprestimo={emprestimoSelecionado}
        onClose={() => setEmprestimoSelecionado(null)}
        onConfirm={carregarEmprestimos}
      />
    </div>
  );
}
