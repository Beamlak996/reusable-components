"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ETHIOPIAN_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ህዳር",
  "ታህሳስ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
];
const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const AMHARIC_DAYS = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

type CalendarType = "ethiopian" | "gregorian";

class EthiopianCalendar {
  static isLeapYear(year: number): boolean {
    return year % 4 === 3;
  }

  static getDaysInMonth(month: number, year: number): number {
    return month < 13 ? 30 : this.isLeapYear(year) ? 6 : 5;
  }

  static ethiopianToGregorian(
    ethYear: number,
    ethMonth: number,
    ethDay: number
  ): Date {
    const baseGregorianYear = ethYear + 7;
    const baseDate = new Date(Date.UTC(baseGregorianYear, 8, 11));
    let totalDays = 0;
    for (let m = 1; m < ethMonth; m++) {
      totalDays += this.getDaysInMonth(m, ethYear);
    }
    totalDays += ethDay - 1;
    const result = new Date(baseDate);
    result.setUTCDate(result.getUTCDate() + totalDays);
    result.setUTCHours(12, 0, 0, 0);
    return result;
  }

  static gregorianToEthiopian(date: Date): {
    year: number;
    month: number;
    day: number;
  } {
    const utcDate = new Date(date);
    utcDate.setUTCHours(12, 0, 0, 0);

    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth() + 1;
    const day = utcDate.getUTCDate();

    let ethYear: number;
    let startOfEthYear: Date;
    if (month < 9 || (month === 9 && day < 11)) {
      ethYear = year - 8;
      startOfEthYear = new Date(Date.UTC(year - 1, 8, 11));
    } else {
      ethYear = year - 7;
      startOfEthYear = new Date(Date.UTC(year, 8, 11));
    }

    const daysDiff = Math.floor(
      (utcDate.getTime() - startOfEthYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    let remainingDays = daysDiff + 1;
    let ethMonth = 1;
    while (
      ethMonth <= 13 &&
      remainingDays > this.getDaysInMonth(ethMonth, ethYear)
    ) {
      remainingDays -= this.getDaysInMonth(ethMonth, ethYear);
      ethMonth++;
    }

    return {
      year: ethYear,
      month: ethMonth,
      day: remainingDays,
    };
  }
}

class GregorianCalendar {
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getDaysInMonth(month: number, year: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return month === 2 && this.isLeapYear(year) ? 29 : daysInMonth[month - 1];
  }

  static getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month - 1, 1).getDay();
  }
}

interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

interface DatePickerProps {
  calendarType?: CalendarType;
  onDateChange?: (date: Date | null) => void;
  className?: string;
  value?: Date | null;
}

export function EthiopianDatePicker({
  calendarType = "ethiopian",
  onDateChange,
  className,
  value,
}: DatePickerProps) {
  const [currentCalendarType, setCurrentCalendarType] =
    useState<CalendarType>(calendarType);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEthiopianDate, setSelectedEthiopianDate] =
    useState<EthiopianDate | null>(null);
  const [selectedGregorianDate, setSelectedGregorianDate] =
    useState<GregorianDate | null>(null);
  const [viewEthiopianDate, setViewEthiopianDate] = useState<EthiopianDate>(
    EthiopianCalendar.gregorianToEthiopian(new Date())
  );
  const [viewGregorianDate, setViewGregorianDate] = useState<GregorianDate>({
    year: new Date().getUTCFullYear(),
    month: new Date().getUTCMonth() + 1,
    day: new Date().getUTCDate(),
  });

  useEffect(() => {
    if (value) {
      const utcDate = new Date(value);
      utcDate.setUTCHours(12, 0, 0, 0);
      setSelectedDate(utcDate);
      setSelectedEthiopianDate(EthiopianCalendar.gregorianToEthiopian(utcDate));
      setSelectedGregorianDate({
        year: utcDate.getUTCFullYear(),
        month: utcDate.getUTCMonth() + 1,
        day: utcDate.getUTCDate(),
      });
      setViewEthiopianDate(EthiopianCalendar.gregorianToEthiopian(utcDate));
      setViewGregorianDate({
        year: utcDate.getUTCFullYear(),
        month: utcDate.getUTCMonth() + 1,
        day: utcDate.getUTCDate(),
      });
    } else {
      setSelectedDate(null);
      setSelectedEthiopianDate(null);
      setSelectedGregorianDate(null);
    }
  }, [value]);

  useEffect(() => {
    if (open && selectedDate) {
      if (currentCalendarType === "ethiopian") {
        setViewEthiopianDate(
          EthiopianCalendar.gregorianToEthiopian(selectedDate)
        );
      } else {
        setViewGregorianDate({
          year: selectedDate.getUTCFullYear(),
          month: selectedDate.getUTCMonth() + 1,
          day: selectedDate.getUTCDate(),
        });
      }
    }
  }, [open, currentCalendarType, selectedDate]);

  const formatEthiopianDate = (date: EthiopianDate | null): string =>
    !date
      ? "ቀን ምረጡ"
      : `${ETHIOPIAN_MONTHS[date.month - 1]} ${date.day}, ${date.year}`;

  const formatGregorianDate = (date: GregorianDate | null): string =>
    !date
      ? "Pick a date"
      : `${GREGORIAN_MONTHS[date.month - 1]} ${date.day}, ${date.year}`;

  const toggleCalendarType = () => {
    setCurrentCalendarType((prev) => {
      const newType = prev === "ethiopian" ? "gregorian" : "ethiopian";
      if (selectedDate) {
        if (newType === "ethiopian") {
          setViewEthiopianDate(
            EthiopianCalendar.gregorianToEthiopian(selectedDate)
          );
        } else {
          setViewGregorianDate({
            year: selectedDate.getUTCFullYear(),
            month: selectedDate.getUTCMonth() + 1,
            day: selectedDate.getUTCDate(),
          });
        }
      }
      return newType;
    });
  };

  const navigateEthiopianMonth = (direction: "prev" | "next") => {
    setViewEthiopianDate((prev) => {
      let newMonth = prev.month + (direction === "next" ? 1 : -1);
      let newYear = prev.year;
      if (newMonth > 13) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 13;
        newYear--;
      }
      return { ...prev, month: newMonth, year: newYear };
    });
  };

  const navigateGregorianMonth = (direction: "prev" | "next") => {
    setViewGregorianDate((prev) => {
      let newMonth = prev.month + (direction === "next" ? 1 : -1);
      let newYear = prev.year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      return { ...prev, month: newMonth, year: newYear };
    });
  };

  const selectEthiopianDate = (day: number) => {
    const newEthDate = { ...viewEthiopianDate, day };
    const newDate = EthiopianCalendar.ethiopianToGregorian(
      newEthDate.year,
      newEthDate.month,
      newEthDate.day
    );
    setSelectedEthiopianDate(newEthDate);
    setSelectedGregorianDate({
      year: newDate.getUTCFullYear(),
      month: newDate.getUTCMonth() + 1,
      day: newDate.getUTCDate(),
    });
    setSelectedDate(newDate);
    setOpen(false);
    if (onDateChange) onDateChange(newDate);
  };

  const selectGregorianDate = (day: number) => {
    const newGregDate = { ...viewGregorianDate, day };
    const newDate = new Date(
      Date.UTC(newGregDate.year, newGregDate.month - 1, newGregDate.day)
    );
    newDate.setUTCHours(12, 0, 0, 0);
    setSelectedGregorianDate(newGregDate);
    setSelectedEthiopianDate(EthiopianCalendar.gregorianToEthiopian(newDate));
    setSelectedDate(newDate);
    setOpen(false);
    if (onDateChange) onDateChange(newDate);
  };

  const renderEthiopianCalendarDays = () => {
    const daysInMonth = EthiopianCalendar.getDaysInMonth(
      viewEthiopianDate.month,
      viewEthiopianDate.year
    );
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedEthiopianDate &&
        selectedEthiopianDate.year === viewEthiopianDate.year &&
        selectedEthiopianDate.month === viewEthiopianDate.month &&
        selectedEthiopianDate.day === day;
      days.push(
        <button
          key={day}
          onClick={() => selectEthiopianDate(day)}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            isSelected &&
              "bg-blue-500 text-primary-foreground hover:bg-blue-500 hover:text-primary-foreground"
          )}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const renderGregorianCalendarDays = () => {
    const daysInMonth = GregorianCalendar.getDaysInMonth(
      viewGregorianDate.month,
      viewGregorianDate.year
    );
    const firstDayOfMonth = GregorianCalendar.getFirstDayOfMonth(
      viewGregorianDate.month,
      viewGregorianDate.year
    );
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedGregorianDate &&
        selectedGregorianDate.year === viewGregorianDate.year &&
        selectedGregorianDate.month === viewGregorianDate.month &&
        selectedGregorianDate.day === day;
      days.push(
        <button
          key={day}
          onClick={() => selectGregorianDate(day)}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            isSelected &&
              "bg-blue-500 text-primary-foreground hover:bg-blue-500 hover:text-primary-foreground"
          )}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const getButtonText = () =>
    currentCalendarType === "ethiopian"
      ? formatEthiopianDate(selectedEthiopianDate)
      : formatGregorianDate(selectedGregorianDate);

  return (
    <div className={cn("flex w-[280px]", className)}>
      <Button
        variant="outline"
        onClick={toggleCalendarType}
        className="px-3 py-2 rounded-r-none border-r-0 text-xs font-medium"
        type="button"
      >
        {currentCalendarType === "ethiopian" ? "ኢት" : "GR"}
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal rounded-l-none",
              !selectedDate && "text-muted-foreground"
            )}
          >
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            {currentCalendarType === "ethiopian" ? (
              <>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateEthiopianMonth("prev")}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    <Select
                      value={viewEthiopianDate.month.toString()}
                      onValueChange={(value) =>
                        setViewEthiopianDate((prev) => ({
                          ...prev,
                          month: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ETHIOPIAN_MONTHS.map((month, index) => (
                          <SelectItem
                            key={index + 1}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={viewEthiopianDate.year.toString()}
                      onValueChange={(value) =>
                        setViewEthiopianDate((prev) => ({
                          ...prev,
                          year: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 21 }, (_, i) => {
                          const year = viewEthiopianDate.year - 10 + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateEthiopianMonth("next")}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {AMHARIC_DAYS.map((day, index) => (
                    <div
                      key={index}
                      className="h-9 w-9 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  {renderEthiopianCalendarDays()}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateGregorianMonth("prev")}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    <Select
                      value={viewGregorianDate.month.toString()}
                      onValueChange={(value) =>
                        setViewGregorianDate((prev) => ({
                          ...prev,
                          month: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GREGORIAN_MONTHS.map((month, index) => (
                          <SelectItem
                            key={index + 1}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={viewGregorianDate.year.toString()}
                      onValueChange={(value) =>
                        setViewGregorianDate((prev) => ({
                          ...prev,
                          year: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 21 }, (_, i) => {
                          const year = viewGregorianDate.year - 10 + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateGregorianMonth("next")}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <div
                        key={index}
                        className="h-9 w-9 flex items-center justify-center text-xs font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {renderGregorianCalendarDays()}
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
