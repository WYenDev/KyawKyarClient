import { useState } from "react";

/**
 * Generic option type
 */
export interface Option<T extends string> {
    label: string;
    value: T;
}

/**
 * Generic Select props
 */
interface SelectProps<T extends string> {
    value: T;                      // ✅ strict, never undefined
    options: Option<T>[];
    onChange: (value: T) => void;  // ✅ strict
    placeholder?: string;
}

function Select<T extends string>({
    value,
    options,
    onChange,
    placeholder = "Select",
}: SelectProps<T>) {
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.value === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left
                           shadow-sm hover:border-indigo-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                    className="
                        absolute z-50 mt-2 w-full
                        rounded-xl bg-white shadow-lg border
                        max-h-60 overflow-y-auto
                    "
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
