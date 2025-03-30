
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExpirationDatePickerProps {
  expirationDate: Date | undefined;
  onExpirationDateChange: (date: Date | undefined) => void;
}

const ExpirationDatePicker: React.FC<ExpirationDatePickerProps> = ({
  expirationDate,
  onExpirationDateChange,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Expires On</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !expirationDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {expirationDate ? format(expirationDate, "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={expirationDate}
            onSelect={onExpirationDateChange}
            initialFocus
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExpirationDatePicker;
