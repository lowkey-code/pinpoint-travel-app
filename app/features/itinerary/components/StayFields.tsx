interface StayFieldsProps {
  breakfastIncluded: boolean
  onBreakfastChange: (checked: boolean) => void
}

export function StayFields({ breakfastIncluded, onBreakfastChange }: StayFieldsProps) {
  return (
    <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={breakfastIncluded}
          onChange={(e) => onBreakfastChange(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm font-medium">Café da manhã incluído</span>
      </label>
    </div>
  )
}
