const variants = {
    base: "h-12 w-full px-4",
    icon: "h-12 w-12",
    iconSmall: "h-8 w-8",
};

export function Button({ children, isLoading, className="", type="button", variant = "base", ...rest }) {
    return (
        <button
            type={type}
            disabled={isLoading}
            className={
                `flex items-center justify-center bg-blue-600 
                text-white rounded-lg font-bold text-sm hover:bg-blue-700 
                disabled:opacity-50 ${variants[variant]} ${className}`}
            {...rest}
        >
            {isLoading ? "Carregando ..." : children}  
        </button>
    )
}