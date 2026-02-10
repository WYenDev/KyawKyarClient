import { useEffect, useId, useState } from "react";

/**
 * Generic option type
 */
export interface Option<T extends string> {
    label: string;
    value: T;
}

interface SelectProps<T extends string> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string; 
}


function Select<T extends string>({
    value,
    options,
    onChange,
    placeholder = "Select",
    className = "",
}: SelectProps<T>) {
    const [open, setOpen] = useState(false);
    const id = useId(); 

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: Event) => {
            const openedId = (e as CustomEvent<string>).detail;
            if (openedId !== id) {
                setOpen(false);
            }
        };

        window.addEventListener("select-open", handler as EventListener);
        return () =>
            window.removeEventListener("select-open", handler as EventListener);
    }, [id]);

    const toggle = () => {
        if (options.length === 0) return; // Prevent opening if no options
        if (!open) {
            window.dispatchEvent(
                new CustomEvent("select-open", { detail: id })
            );
        }
        setOpen((prev) => !prev);
    };


    return (
        <div className="relative">
            <button
                type="button"
                onClick={toggle}
                className={`
    relative w-full
    rounded-xl border border-gray-300 bg-white
    px-4 py-2 text-sm text-left
    shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-200
    ${className}
  `}
            >


                <div className="flex justify-between items-center">
                    <span className={selected ? "text-gray-900" : "text-gray-400"}>
                        {selected?.label ?? placeholder}
                    </span>
                    <span className="text-gray-400">▾</span>
                </div>
            </button>

            {open && (
                <div
                    className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border
                               max-h-60 overflow-y-auto"
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition
                                ${value === opt.value
                                    ? "bg-indigo-100 text-indigo-700 font-medium"
                                    : "text-gray-700"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Select;
