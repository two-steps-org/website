export type BookingSlot = {
  start: string;
  label: string;
};

export type BookingDay = {
  date: string;
  label: string;
  slots: BookingSlot[];
};

export type BookingAvailability = {
  timezone: string;
  durationMin: number;
  days: BookingDay[];
};
