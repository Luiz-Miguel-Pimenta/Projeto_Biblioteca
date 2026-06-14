export function Input({ legend, type="text", ...rest }) {
    return (
        <fieldset className="flex flex-col flex-1 w-full text-slate-600">
            {legend && (
                <legend className="uppercase text-xs font-bold mb-2">
                    { legend }
                </legend>
            )}

            <input 
                type={type} 
                className="w-full h-12 rounded-lg border border-slate-300 
                px-4 text-sm text-slate-800 bg-white outline-none focus:border-blue-500 
                placeholder-slate-400"
                {...rest}
            />
        </fieldset>
    )
}