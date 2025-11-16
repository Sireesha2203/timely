import dayjs from 'dayjs'

// Convert event start to dayjs and compute end time
export function eventRange(ev) {
  const start = dayjs(ev.date + ' ' + (ev.time || '00:00'));
  const end = start.add(ev.duration || 0, 'minute');
  return { start, end };
}

export function overlaps(a, b) {
  const A = eventRange(a);
  const B = eventRange(b);
  return A.start.isBefore(B.end) && B.start.isBefore(A.end);
}

export function hasConflict(candidate, events, ignoreId = null) {
  return events.some((ev) => {
    if (ignoreId && ev.id === ignoreId) return false;
    // only compare events on the same date
    if (ev.date !== candidate.date) return false;
    return overlaps(ev, candidate);
  });
}
