import Select, { Option } from "../../../components/Select";
import {
    Fuel,
    Transmission,
    Status,
    Steering,
} from "../../../services/api";

export type CarForm = {
    modelId: string;
    modelYear: number;
    price: number;
    mileage: number;
    enginePower?: number | null;
    fuel: Fuel;
    transmission: Transmission;
    steering?: Steering;
    status: Status;
    colorId: string;
    showroomId?: string;
    buildTypeId?: string;
    gradeId?: string;
    isNewArrival?: boolean;
};

type Props = {
    form: CarForm;
    setForm: (f: CarForm) => void;
    modelOptions: Option<string>[];
    colorOptions: Option<string>[];
    showroomOptions: Option<string>[];
    buildTypeOptions: Option<string>[];
    gradeOptions: Option<string>[];
};

export const CarFormFields = ({
    form,
    setForm,
    modelOptions,
    colorOptions,
    showroomOptions,
    buildTypeOptions,
    gradeOptions,
}: Props) => (
    <div className="space-y-6">
        {/* SELECTS */}
        <div className="grid grid-cols-2 gap-4">
            <Select
                value={form.modelId}
                options={modelOptions}
                placeholder="Model"
                onChange={(v) => setForm({ ...form, modelId: v ?? "" })}
            />

            <Select
                value={form.colorId}
                options={colorOptions}
                placeholder="Color"
                onChange={(v) => setForm({ ...form, colorId: v ?? "" })}
            />

            <Select
                value={form.showroomId ?? ""}
                options={showroomOptions}
                placeholder="Showroom"
                onChange={(v) =>
                    setForm({ ...form, showroomId: v || undefined })
                }
            />

            <Select
                value={form.buildTypeId ?? ""}
                options={buildTypeOptions}
                placeholder="Build Type"
                onChange={(v) =>
                    setForm({ ...form, buildTypeId: v || undefined })
                }
            />

            <Select
                value={form.gradeId ?? ""}
                options={gradeOptions}
                placeholder="Grade"
                onChange={(v) =>
                    setForm({ ...form, gradeId: v || undefined })
                }
            />
        </div>

        {/* NUMBERS */}
        <div className="grid grid-cols-4 gap-4">
            <Input
                label="Model Year"
                value={form.modelYear}
                onChange={(v) =>
                    setForm({ ...form, modelYear: Number(v) })
                }
            />

            <Input
                label="Price"
                value={form.price}
                onChange={(v) =>
                    setForm({ ...form, price: Number(v) })
                }
            />

            <Input
                label="Mileage"
                value={form.mileage}
                onChange={(v) =>
                    setForm({ ...form, mileage: Number(v) })
                }
            />

            <Input
                label="Engine Power"
                value={form.enginePower ?? ""}
                onChange={(v) =>
                    setForm({
                        ...form,
                        enginePower: v ? Number(v) : null,
                    })
                }
            />
        </div>

        {/* ENUMS */}
        <div className="grid grid-cols-4 gap-4">
            <Select
                value={form.fuel}
                options={[
                    { label: "Petrol", value: Fuel.Petrol },
                    { label: "Diesel", value: Fuel.Diesel },
                    { label: "Electric", value: Fuel.Electric },
                    { label: "Hybrid", value: Fuel.Hybrid },
                ]}
                placeholder="Fuel"
                onChange={(v) => setForm({ ...form, fuel: v! })}
            />

            <Select
                value={form.transmission}
                options={[
                    { label: "Manual", value: Transmission.Manual },
                    { label: "Automatic", value: Transmission.Automatic },
                    { label: "CVT", value: Transmission.CVT },
                ]}
                placeholder="Transmission"
                onChange={(v) => setForm({ ...form, transmission: v! })}
            />

            <Select
                value={form.steering ?? Steering.Left}
                options={[
                    { label: "Left", value: Steering.Left },
                    { label: "Right", value: Steering.Right },
                ]}
                placeholder="Steering"
                onChange={(v) => setForm({ ...form, steering: v })}
            />

            <Select
                value={form.status}
                options={[
                    { label: "Available", value: Status.Available },
                    { label: "Sold", value: Status.Sold },
                ]}
                placeholder="Status"
                onChange={(v) => setForm({ ...form, status: v! })}
            />
        </div>

        {/* FLAGS */}
        <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={!!form.isNewArrival}
                onChange={(e) =>
                    setForm({ ...form, isNewArrival: e.target.checked })
                }
            />
            New Arrival
        </label>
    </div>
);

/* ===================== INPUT ===================== */
const Input = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
}) => (
    <div>
        <label className="block text-sm mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-3 rounded-xl w-full"
        />
    </div>
);
