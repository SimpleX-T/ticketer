import * as React from "react";
import { format, setHours, setMinutes, isBefore, addMinutes } from "date-fns";
import {
  CalendarIcon,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickTimePresets, TimeSelect } from "../date-time/time-select";

export interface QuickTimeOption {
  label: string;
  fromHours: string;
  fromMinutes: string;
  toHours: string;
  toMinutes: string;
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}) {
  // Initialize with value from props or default
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [showTimeWarning, setShowTimeWarning] = React.useState(false);

  const [fromTime, setFromTime] = React.useState({
    hours: value?.from ? format(value.from, "HH") : "09",
    minutes: value?.from ? format(value.from, "mm") : "00",
  });

  const [toTime, setToTime] = React.useState({
    hours: value?.to ? format(value.to, "HH") : "17",
    minutes: value?.to ? format(value.to, "mm") : "00",
  });

  const [open, setOpen] = React.useState(false);

  // Update internal state when props change
  React.useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(date)) {
      setDate(value);

      if (value.from) {
        setFromTime({
          hours: format(value.from, "HH"),
          minutes: format(value.from, "mm"),
        });
      }

      if (value.to) {
        setToTime({
          hours: format(value.to, "HH"),
          minutes: format(value.to, "mm"),
        });
      }
    }
  }, [value, date]);

  // Only disable days completely in the past
  const disablePastDates = React.useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    return isBefore(date, today);
  }, []);

  // Validate and adjust the time if needed
  const validateAndAdjustTime = React.useCallback(
    (dateToCheck: Date | undefined): Date | undefined => {
      if (!dateToCheck) return undefined;

      const minimumAllowedTime = addMinutes(new Date(), 5);
      const currentDay = new Date();
      currentDay.setHours(0, 0, 0, 0);

      // If the date is today and the time is less than minimum allowed
      if (
        dateToCheck.getDate() === currentDay.getDate() &&
        dateToCheck.getMonth() === currentDay.getMonth() &&
        dateToCheck.getFullYear() === currentDay.getFullYear() &&
        isBefore(dateToCheck, minimumAllowedTime)
      ) {
        // Show warning message
        setShowTimeWarning(true);

        // Hide warning after 3 seconds
        setTimeout(() => setShowTimeWarning(false), 3000);

        // Return the minimum allowed time
        return minimumAllowedTime;
      }

      // Otherwise return the original date
      return dateToCheck;
    },
    []
  );

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!newDate) {
      setDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
      return;
    }

    // Validate and adjust the "from" time if needed
    const validatedFrom = validateAndAdjustTime(newDate.from);

    // If the time was adjusted, update the time selectors too
    if (
      validatedFrom &&
      newDate.from &&
      validatedFrom.getTime() !== newDate.from.getTime()
    ) {
      setFromTime({
        hours: format(validatedFrom, "HH"),
        minutes: format(validatedFrom, "mm"),
      });
    }

    const validatedDate = {
      from: validatedFrom,
      to: newDate.to,
    };

    setDate(validatedDate);
    if (onChange) {
      onChange(validatedDate);
    }
  };

  const handleTimeChange = (
    type: "from" | "to",
    field: "hours" | "minutes",
    value: string
  ) => {
    if (!date) return;

    const newTime = type === "from" ? { ...fromTime } : { ...toTime };
    newTime[field] = value;

    let newDate = { ...date };

    if (type === "from") {
      setFromTime(newTime);
      const newFrom = date.from
        ? setHours(
            setMinutes(date.from, Number.parseInt(newTime.minutes)),
            Number.parseInt(newTime.hours)
          )
        : undefined;

      // Validate and adjust the time if needed
      const validatedFrom = validateAndAdjustTime(newFrom);

      // If the time was adjusted, update the time selectors too
      if (
        validatedFrom &&
        newFrom &&
        validatedFrom.getTime() !== newFrom.getTime()
      ) {
        setFromTime({
          hours: format(validatedFrom, "HH"),
          minutes: format(validatedFrom, "mm"),
        });
      }

      newDate = { ...date, from: validatedFrom };
    } else {
      setToTime(newTime);
      const newTo = date.to
        ? setHours(
            setMinutes(date.to, Number.parseInt(newTime.minutes)),
            Number.parseInt(newTime.hours)
          )
        : undefined;

      newDate = { ...date, to: newTo };
    }

    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  const handleDone = () => {
    setOpen(false);
  };

  const applyQuickTime = (option: QuickTimeOption) => {
    if (!date?.from || !date?.to) return;

    setFromTime({ hours: option.fromHours, minutes: option.fromMinutes });
    setToTime({ hours: option.toHours, minutes: option.toMinutes });

    let newFrom = setHours(
      setMinutes(date.from, Number.parseInt(option.fromMinutes)),
      Number.parseInt(option.fromHours)
    );

    // Validate and adjust the time if needed
    const validatedFrom = validateAndAdjustTime(newFrom);

    // If the time was adjusted, update the time selectors too
    if (validatedFrom && validatedFrom.getTime() !== newFrom.getTime()) {
      setFromTime({
        hours: format(validatedFrom, "HH"),
        minutes: format(validatedFrom, "mm"),
      });
      newFrom = validatedFrom;
    }

    const newTo = setHours(
      setMinutes(date.to, Number.parseInt(option.toMinutes)),
      Number.parseInt(option.toHours)
    );

    const newDate = { from: newFrom, to: newTo };
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left bg-primary-200 hover:bg-primary-100/60 hover:text-secondary text-secondary p-6 cursor-pointer border-none font-normal transition-all",
              !date && "text-muted-foreground",
              open && "ring ring-primary-100"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "EEE, MMM d")}{" "}
                  {format(date.from, "h:mm a")} -{" "}
                  {format(date.to, "EEE, MMM d")} {format(date.to, "h:mm a")}
                </>
              ) : (
                format(date.from, "EEE, MMM d, yyyy h:mm a")
              )
            ) : (
              <span className="text-secondary">Pick a date and time range</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 bg-primary-200 text-secondary border-secondary-200 shadow-md rounded-md"
          sideOffset={7}
          align="start"
        >
          <div className="p-4 pb-0r">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Select Date & Time Range</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-3 bg-secondary-400 text-white rounded-md shadow-lg">
                    <p className="text-sm font-medium">How to use:</p>
                    <p>1. Select a date range on the calendar</p>
                    <p>2. Choose start and end times</p>
                    <p>3. Click "Done" to confirm your selection</p>
                    <p className="text-xs mt-2 italic">
                      Note: You can only select times at least 5 minutes in the
                      future.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Tabs defaultValue="calendar" className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-2 mb-2 bg-secondary-200">
                <TabsTrigger
                  value="calendar"
                  className="bg-secondary-200 text-secondary-100 data-[state=active]:bg-primary-100 data-[state=active]:text-secondary data-[state=active]:font-medium cursor-pointer"
                >
                  Calendar
                </TabsTrigger>
                <TabsTrigger
                  value="time"
                  className="bg-secondary-200 text-secondary-100 data-[state=active]:bg-primary-100 data-[state=active]:text-secondary data-[state=active]:font-medium cursor-pointer"
                >
                  Time
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar" className="p-1">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from || new Date()}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
                disabled={disablePastDates}
                className="rounded-md border border-secondary-200"
              />
            </TabsContent>

            <TabsContent value="time" className="p-4 pt-2">
              <div className="space-y-4">
                {showTimeWarning && (
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Time adjusted to be at least 5 minutes from now.
                  </div>
                )}

                <QuickTimePresets onSelect={applyQuickTime} />

                {date?.from && (
                  <TimeSelect
                    value={fromTime}
                    onChange={(field, value) =>
                      handleTimeChange("from", field, value)
                    }
                    label="Start"
                  />
                )}

                {date?.to && (
                  <TimeSelect
                    value={toTime}
                    onChange={(field, value) =>
                      handleTimeChange("to", field, value)
                    }
                    label="End"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between p-2 border-t mt-4 border-secondary-200">
            <div className="text-xs text-secondary-100">
              {date?.from && date?.to ? (
                <>
                  <span className="font-medium">Duration:</span>{" "}
                  {Math.ceil(
                    (date.to.getTime() - date.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </>
              ) : (
                "Select both start and end dates"
              )}
            </div>
            <Button
              size="sm"
              onClick={handleDone}
              className="gap-1 bg-primary-100 hover:bg-primary-100/80 text-secondary rounded-xs cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
