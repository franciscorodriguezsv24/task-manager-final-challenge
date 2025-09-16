import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DatePicker,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  type DateValue,
} from "react-aria-components";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import styles from "./calendar.module.scss";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
} from "@remixicon/react";

interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
}

export const CalendarC = ({
  value,
  onChange,
  placeholder = "Due Date",
}: CalendarProps) => {
  const dateToDateValue = (date: Date | null): DateValue | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return parseDate(`${year}-${month}-${day}`);
  };

  const dateValueToDate = (dateValue: DateValue | null): Date | null => {
    if (!dateValue) return null;
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  };

  const selectedDateValue = dateToDateValue(value || null);

  const handleDateChange = (newDateValue: DateValue | null) => {
    const newDate = dateValueToDate(newDateValue);
    onChange?.(newDate);
  };

  const handleSetToday = () => {
    const todayDateValue = today(getLocalTimeZone());
    const todayDate = dateValueToDate(todayDateValue);
    onChange?.(todayDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      date,
    );
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}. ${day} ${year}`; // Dec. 16 2020
  };

  return (
    <DatePicker
      className={styles.DatePickerElement}
      value={selectedDateValue}
      onChange={handleDateChange}
    >
      <Label />
      <Group>
        <Button className={styles.datePickerInput}>
          <RiCalendarCheckLine />
          {value ? (
            <span className={styles.inputCalendar}>{formatDate(value)}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </Button>
      </Group>
      <Text slot="description" />
      <FieldError />
      <Popover>
        <Dialog className={styles.dialogContainer}>
          <Calendar
            className={styles.containerCalendar}
            minValue={today(getLocalTimeZone())}
          >
            <div className={styles.actionCalendar}>
              <Button slot="previous">
                <RiArrowLeftSLine />
              </Button>
              <Heading className={styles.headerCalendar} />
              <Button slot="next">
                <RiArrowRightSLine />
              </Button>
            </div>
            <CalendarGrid className={styles.calendarContainer}>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className={styles.weekDays}>
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell date={date} className={styles.calendarCell} />
                )}
              </CalendarGridBody>
            </CalendarGrid>
            <Text slot="errorMessage" />
          </Calendar>
          <div className={styles.todayButtonWrapper}>
            <Button onPress={handleSetToday} className={styles.todayButton}>
              Today
            </Button>
          </div>
        </Dialog>
      </Popover>
    </DatePicker>
  );
};
