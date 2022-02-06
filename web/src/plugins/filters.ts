/**
 * Filters are no longer supported by VueJS 3, and are replaced by
 *   global properties or computed values.
 *
 * Source: https://v3.vuejs.org/guide/migration/filters.html#overview
 */

import dayjs from "dayjs";

/** Format a date according to a DayJS/MomentJS format string */
const formatDate = (date: Date, format: string): string => {
  return date ? dayjs(date).format(format) : "";
};

const filters = {
  formatDate,
};

export default filters;
export { formatDate };
