
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  disabledDays: { before: Date };
}

export default function DateSelector({
  selectedDate,
  onDateSelect,
  disabledDays
}: DateSelectorProps) {
  return (
    <div className="flex-1">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDays}
        className={cn("rounded-md border shadow p-3")}
        initialFocus
      />
    </div>
  );
}
