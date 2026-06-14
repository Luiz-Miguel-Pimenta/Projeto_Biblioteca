export function Select({ legend, children, ...rest }) {
    return (
        <fieldset className="flex flex-col flex-1 w-full text-slate-600">
            {legend && (
                <legend className="uppercase text-xs font-bold mb-2">
                    {legend}
                </legend>
            )}

            <select 
                className="w-full h-12 rounded-lg border 
                border-slate-300 px-4 text-sm text-slate-800 
                bg-white outline-none focus:border-blue-500"
                {...rest}
            >
                <option value="" disabled selected hidden>
                    Seleciona uma opção
                </option>
                
                {children}
            </select>
        </fieldset>
    )
}