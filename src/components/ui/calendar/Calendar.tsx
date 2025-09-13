import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  type DateValue,
} from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";

import styles from "./calendar.module.scss";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarCheckLine,
} from "@remixicon/react";
import { useState } from "react";

export const CalendarC = () => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);

  const handleSetToday = () => {
    setSelectedDate(today(getLocalTimeZone()));
  };

  return (
    <DatePicker
      className={styles.DatePickerElement}
      value={selectedDate}
      onChange={setSelectedDate}
    >
      <Label />
      <Group>
        <Button className={styles.datePickerInput}>
          <RiCalendarCheckLine />
          {selectedDate ? (
            <DateInput className={styles.inputCalendar}>
              {(segment) => <DateSegment segment={segment} />}
            </DateInput>
          ) : (
            <span className={styles.placeholder}>Due Date</span>
          )}
        </Button>
      </Group>
      <Text slot="description" />
      <FieldError />
      <Popover>
        <Dialog className={styles.dialogContainer}>
          <Calendar className={styles.containerCalendar}>
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
