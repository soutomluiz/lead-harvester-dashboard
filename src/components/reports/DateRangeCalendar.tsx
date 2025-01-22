import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeCalendarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeCalendar({ dateRange, onDateRangeChange }: DateRangeCalendarProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "PPP", { locale: ptBR });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
              </>
            ) : (
              formatDate(dateRange.from)
            )
          ) : (
            "Selecione um período"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range: { from?: Date; to?: Date } | undefined) => {
            onDateRangeChange({
              from: range?.from,
              to: range?.to,
            });
          }}
          numberOfMonths={2}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}