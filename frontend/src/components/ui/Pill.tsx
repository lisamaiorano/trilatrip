type Props = {
  label: string
  selected: boolean
  onClick: () => void
}

function Pill({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
        selected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  )
}

export default Pill
