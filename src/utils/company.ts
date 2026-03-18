export const COMPANY_START_DATE = {
  year: 2018,
  month: 3,
  day: 23,
} as const;

export const getCompanyYears = (date: Date = new Date()): number =>
  date.getFullYear() -
  COMPANY_START_DATE.year -
  (date.getMonth() + 1 < COMPANY_START_DATE.month ||
  (date.getMonth() + 1 === COMPANY_START_DATE.month && date.getDate() < COMPANY_START_DATE.day)
    ? 1
    : 0);
