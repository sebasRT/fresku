import { DateTime } from 'luxon';

function parseToUTC(date: string | Date, timezone: string = "UTC"): DateTime {

    const dt = date instanceof Date
        ? DateTime.fromJSDate(date, { zone: timezone })
        : DateTime.fromISO(date, { zone: timezone })

    return dt.toUTC()
}

function getNowInUTC() {
    return DateTime.now().toUTC();
}

export { getNowInUTC, parseToUTC };

