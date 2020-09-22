import {compareAsc, compareDesc, isEqual} from "date-fns"
import {catchInfiniteInterval, isEmpty} from "./misc"

export function areIntervalsIntersecting(...intervals: Array<Interval>): boolean {
    if (isEmpty(intervals) || intervals.length === 1) {
        return true
    }
    return intervals.every(left => intervals.every(right => left.start <= right.end))
}

export function areIntervalsConnected(...intervals: Array<Interval>): boolean {
    if (isEmpty(intervals)) {
        return true
    }
    intervals = intervals.map(catchInfiniteInterval)
    return intervals.every((leftInterval, i) => intervals.some((rightInterval, j) => (compareAsc(leftInterval.start, rightInterval.end) <= 0) && (i !== j)))
}

export function areIntervalsEqual(...intervals: Array<Interval>): boolean {
    if (isEmpty(intervals)) {
        return true
    }
    intervals = intervals.map(catchInfiniteInterval)
    return intervals.every(interval => isEqual(interval.start, intervals[0].start)) && intervals.every(interval => isEqual(interval.end, intervals[0].end))
}

export function joinIntervals(...intervals: Array<Interval>): Interval {
    if (isEmpty(intervals)) {
        throw Error("Need to provide at least one interval to join.")
    }
    intervals = intervals.map(catchInfiniteInterval)
    if (!areIntervalsConnected(...intervals)) {
        throw Error("Can't join intervals as they are disjoint!")
    }
    return {
        start: [...intervals].sort((a, b) => compareAsc(a.start, b.start))[0].start,
        end: [...intervals].sort((a, b) => compareDesc(a.end, b.end))[0].end
    }
}

export function mergeIntervals(...intervals: Array<Interval>): Array<Interval> {
    if (isEmpty(intervals)) {
        return []
    }
    intervals = intervals.map(catchInfiniteInterval)

    function reducer(aggregate: Array<Interval>, currentValue: Interval): Array<Interval> {
        let lastInterval = aggregate.slice(-1)[0]
        if (areIntervalsConnected(lastInterval, currentValue)) {
            return [...aggregate.slice(0, -1), joinIntervals(lastInterval, currentValue)]
        } else {
            return [...aggregate, currentValue]
        }
    }

    let sortedIntervals = [...intervals].sort((a, b) => compareAsc(a.start, b.start))
    return sortedIntervals.slice(1).reduce(reducer, [sortedIntervals[0]])
}

export function intersectIntervals(...intervals: Array<Interval>): Interval {
    if (isEmpty(intervals)) {
        throw Error("Please provide at least one interval!")
    }
    if (!areIntervalsIntersecting(...intervals)) {
        throw Error("Can't intersect the given intervals!")
    }
    return {
        start: [...intervals].sort((a, b) => compareDesc(a.start, b.start))[0].start,
        end: [...intervals].sort((a, b) => compareAsc(a.end, b.end))[0].end
    }
}