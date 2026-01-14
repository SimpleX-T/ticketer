import { CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { QuickTimeOption } from "../ui/date-picker-with-range";

// components/date-time/time-select.tsx
export function TimeSelect({
  value,
  onChange,
  label,
}: {
  value: { hours: string; minutes: string };
  onChange: (type: "hours" | "minutes", value: string) => void;
  label: string;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="ml-2 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 ml-8">
        <Select
          value={value.hours}
          onValueChange={(value) => onChange("hours", value)}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem
                key={`hour-${i}`}
                value={i.toString().padStart(2, "0")}
              >
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span>:</span>

        <Select
          value={value.minutes}
          onValueChange={(value) => onChange("minutes", value)}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem
                key={`hour-${i}`}
                value={i.toString().padStart(2, "0")}
              >
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {parseInt(value.hours) < 12 ? "AM" : "PM"}
        </span>
      </div>
    </div>
  );
}

// components/date-time/quick-time-presets.tsx
export function QuickTimePresets({
  onSelect,
}: {
  onSelect: (option: QuickTimeOption) => void;
}) {
  //   Predefined time options for quick selection
  const quickTimeOptions = [
    {
      label: "Morning",
      fromHours: "09",
      fromMinutes: "00",
      toHours: "12",
      toMinutes: "00",
    },
    {
      label: "Afternoon",
      fromHours: "13",
      fromMinutes: "00",
      toHours: "17",
      toMinutes: "00",
    },
    {
      label: "Evening",
      fromHours: "18",
      fromMinutes: "00",
      toHours: "21",
      toMinutes: "00",
    },
    {
      label: "Full Day",
      fromHours: "09",
      fromMinutes: "00",
      toHours: "17",
      toMinutes: "00",
    },
  ];

  return (
    <div className="grid gap-2">
      <h4 className="text-sm font-medium mb-1">Quick Time Presets</h4>
      <div className="grid grid-cols-2 gap-2">
        {quickTimeOptions.map((option) => (
          <Button
            key={option.label}
            variant="outline"
            size="sm"
            className="justify-start bg-secondary-200 text-secondary hover:bg-secondary-100/60 hover:text-secondary cursor-pointer border-secondary/30 rounded-xs"
            onClick={() => onSelect(option)}
          >
            <Clock className="mr-2 h-3 w-3" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
