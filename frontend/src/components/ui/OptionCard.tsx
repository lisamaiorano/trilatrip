import type { LucideIcon } from "lucide-react"

type Props = {
  label: string
  description?: string
  icon?: LucideIcon
  selected: boolean
  onClick: () => void
}

function OptionCard({ label, description, icon: Icon, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      {Icon && (
        <Icon
          size={22}
          className={selected ? "text-blue-600" : "text-gray-400"}
        />
      )}

      <p className="mt-3 font-semibold">{label}</p>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </button>
  )
}

export default OptionCard
