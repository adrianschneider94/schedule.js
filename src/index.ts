import {Interval} from "date-fns"

export const MAX_RECURSIONS = 1000
export const DateInfinity = 8640000000000000

export type direction = "forward" | "backward" | 1 | -1
export type Schedule = (startDate: Date | number, direction?: direction) => IterableIterator<Interval>

export {
    ScheduleFromIntervals,
    RegularSchedule,
    DailyScheduleWithTimezone
} from "./schedules"

export {
    invertSchedule,
    intersectSchedules,
    subtractSchedules,
    symmetricDifferenceOfSchedules,
    joinSchedules
} from "./operations"

export {
    addDuration,
    isWithinSchedule
} from "./functions"