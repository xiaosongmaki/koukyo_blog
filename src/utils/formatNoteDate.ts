import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SITE } from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatNoteDate = (date: Date, format = "YYYY.MM.DD") =>
  dayjs(date).tz(SITE.timezone).format(format);

// English short weekday, e.g. "Sat" (dayjs default locale)
export const formatNoteWeekday = (date: Date) => formatNoteDate(date, "ddd");
