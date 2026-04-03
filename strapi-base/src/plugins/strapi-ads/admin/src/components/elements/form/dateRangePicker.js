import { DatePicker, Flex, Typography } from '@strapi/design-system';
import React from 'react';

// Converts a date string or JS Date to a Date object for display in the picker
// Handles timezone offset to ensure the picker displays the correct date
const toDisplayDate = (value) => {
  if (!value) return undefined;

  // If value is already a YYYY-MM-DD string, parse it
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    // Create a local date at noon to avoid any timezone edge cases
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  // For Date objects, normalize to noon local time to avoid timezone issues
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
};

// Converts the picker's selected date to a clean Date object at midnight local time
const toCleanDate = (date) => {
  if (!date) return undefined;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

const DateRangePicker = (props = {}) => {
  const {
    startDate,
    endDate,
    onStartDateChange = () => {},
    onEndDateChange = () => {},
    minDate,
    maxDate = new Date(),
    locale = 'en-GB',
    size = 'M',
    ...otherProps
  } = props;
  // Convert all dates to display dates for the picker
  const displayStartDate = toDisplayDate(startDate);
  const displayEndDate = toDisplayDate(endDate);
  const displayMinDate = toDisplayDate(minDate);
  const displayMaxDate = toDisplayDate(maxDate);

  return (
    <Flex gap={2} alignItems="center">
      <DatePicker
        selectedDate={displayStartDate}
        onChange={(date) => {
          const cleanDate = date ? toCleanDate(date) : null;
          onStartDateChange(cleanDate);
        }}
        {...(displayMinDate && { minDate: displayMinDate })}
        {...(displayEndDate ? { maxDate: displayEndDate } : displayMaxDate ? { maxDate: displayMaxDate } : {})}
        locale={locale}
        size={size}
        {...otherProps}
      />
      <Typography variant="pi" textColor="neutral600">
        to
      </Typography>
      <DatePicker
        selectedDate={displayEndDate}
        onChange={(date) => {
          const cleanDate = date ? toCleanDate(date) : null;
          onEndDateChange(cleanDate);
        }}
        {...(displayStartDate && { minDate: displayStartDate })}
        {...(displayMaxDate && { maxDate: displayMaxDate })}
        locale={locale}
        size={size}
        {...otherProps}
      />
    </Flex>
  );
};

export default DateRangePicker;
