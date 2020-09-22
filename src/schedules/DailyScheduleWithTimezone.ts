import {Schedule} from "../index"
import {add, isWithinInterval, parse} from "date-fns"
import {utcToZonedTime} from "date-fns-tz"

export function DailyScheduleWithTimezone(startTime: string, endTime: string, timeZone: string = "Etc/UTC", format: string = "HH:mm"): Schedule {
    return function* (startDate) {
        startDate = new Date(startDate)
        if (format.indexOf('X') !== -1 || format.indexOf('x') !== -1) {
            throw Error("Time strings may not contain timezone information!")
        }

        let startTimeString = parse(startTime + "Z", format + "X", new Date(0)).toISOString().slice(11, -1)
        let endTimeString = parse(endTime + "Z", format + "X", new Date(0)).toISOString().slice(11, -1)

        let dayString = startDate.toISOString().slice(0, 11)
        let firstInterval: Interval = {
            start: utcToZonedTime((dayString + startTimeString), timeZone),
            end: utcToZonedTime((dayString + endTimeString), timeZone)
        }
        if (startDate <= firstInterval.start) {
            yield firstInterval
        } else if (isWithinInterval(startDate, firstInterval)) {
            yield {
                start: startDate,
                end: firstInterval.end
            }
        }

        let i = 1
        while (true) {
            let day = add(startDate, {days: i}).toISOString().slice(0, 11)
            yield {
                start: utcToZonedTime((day + startTimeString), timeZone),
                end: utcToZonedTime((day + endTimeString), timeZone),
            }
            i++
        }
    }
}