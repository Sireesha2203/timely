import dayjs from 'dayjs'

export const getTimeFormat = () => {
  return localStorage.getItem('timely.timeFormat') || '12h'
}

export const getDateFormat = () => {
  return localStorage.getItem('timely.dateFormat') || 'MM/DD/YYYY'
}

export const formatTime = (time) => {
  if (!time) return ''
  
  const timeFormat = getTimeFormat()
  
  if (timeFormat === '24h') {
    return time // Return as is for 24-hour format (HH:mm)
  } else {
    // Convert to 12-hour format with AM/PM
    const [hours, minutes] = time.split(':')
    let hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12 // Convert to 12-hour format
    return `${hour}:${minutes} ${ampm}`
  }
}

export const formatDate = (date) => {
  if (!date) return ''
  
  const dateFormat = getDateFormat()
  const dayjsDate = dayjs(date)
  
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return dayjsDate.format('DD/MM/YYYY')
    case 'YYYY-MM-DD':
      return dayjsDate.format('YYYY-MM-DD')
    case 'MM/DD/YYYY':
    default:
      return dayjsDate.format('MM/DD/YYYY')
  }
}

export const formatDateTime = (date, time) => {
  return `${formatDate(date)} ${formatTime(time)}`
}

// Convert 12-hour time with AM/PM to 24-hour format for storage
export const convertTo24Hour = (time) => {
  if (!time) return ''
  
  // If already in 24-hour format (no AM/PM), return as is
  if (!time.includes('AM') && !time.includes('PM')) {
    return time
  }
  
  const [timePart, period] = time.split(' ')
  const [hours, minutes] = timePart.split(':')
  let hour = parseInt(hours)
  
  if (period === 'PM' && hour !== 12) {
    hour += 12
  } else if (period === 'AM' && hour === 12) {
    hour = 0
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`
}

// Get date input format based on user preference
export const getDateInputFormat = () => {
  const dateFormat = getDateFormat()
  
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return 'DD/MM/YYYY'
    case 'YYYY-MM-DD':
      return 'YYYY-MM-DD'
    case 'MM/DD/YYYY':
    default:
      return 'MM/DD/YYYY'
  }
}
