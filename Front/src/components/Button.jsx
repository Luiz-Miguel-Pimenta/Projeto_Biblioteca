const temas = {
    principal: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
    secundario: "hover:text-red-500 text-slate-500 border border-transparent",
    apagado: "bg-transparent text-slate-600 hover:text-blue-600 border-2 border-slate-300 hover:border-blue-600",
    fantasma: "bg-transparent text-slate-500 hover:text-blue-600 border border-transparent",
};

const tamanhos = {
    base: "h-12 px-6 text-sm",
    small: "h-10 px-4 text-xs",
    icon: "h-10 w-10",
    link: "h-6 text-sm"
};

export function Button({ children, isLoading, className="", type="button", tema = "principal", tamanho = "base", ...rest }) {
    return (
        <button
            type={type}
            disabled={isLoading}
            className={
                `flex items-center px-1 justify-center rounded-lg font-bold transition-all ease-linear 
                disabled:opacity-50 cursor-pointer
                ${temas[tema]} 
                ${tamanhos[tamanho]}
                ${className}
            `}
            {...rest}
        >
            {isLoading ? "Carregando ..." : children}  
        </button>
    )
}