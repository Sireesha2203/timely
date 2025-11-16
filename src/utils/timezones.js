export const worldCities = [
  // Americas
  { name: 'New York', country: 'USA', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060, offset: -5 },
  { name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437, offset: -8 },
  { name: 'Chicago', country: 'USA', timezone: 'America/Chicago', lat: 41.8781, lng: -87.6298, offset: -6 },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', lat: 43.6532, lng: -79.3832, offset: -5 },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', lat: 19.4326, lng: -99.1332, offset: -6 },
  { name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', lat: -23.5505, lng: -46.6333, offset: -3 },
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', lat: -34.6037, lng: -58.3816, offset: -3 },
  
  // Europe
  { name: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278, offset: 0 },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522, offset: 1 },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', lat: 52.5200, lng: 13.4050, offset: 1 },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', lat: 40.4168, lng: -3.7038, offset: 1 },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', lat: 41.9028, lng: 12.4964, offset: 1 },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', lat: 55.7558, lng: 37.6173, offset: 3 },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', lat: 41.0082, lng: 28.9784, offset: 3 },
  
  // Asia
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708, offset: 4 },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777, offset: 5.5 },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198, offset: 8 },
  { name: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694, offset: 8 },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503, offset: 9 },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', lat: 37.5665, lng: 126.9780, offset: 9 },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', lat: 31.2304, lng: 121.4737, offset: 8 },
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.7563, lng: 100.5018, offset: 7 },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093, offset: 10 },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', lat: -37.8136, lng: 144.9631, offset: 10 },
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', lat: -36.8485, lng: 174.7633, offset: 12 },
  
  // Africa
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', lat: 30.0444, lng: 31.2357, offset: 2 },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', lat: 6.5244, lng: 3.3792, offset: 1 },
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', lat: -26.2041, lng: 28.0473, offset: 2 },
]

export const getTimeInTimezone = (timezone) => {
  const now = new Date()
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }
  return new Intl.DateTimeFormat('en-US', options).format(now)
}

export const getDateInTimezone = (timezone) => {
  const now = new Date()
  const options = {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(now)
}

export const getTimezoneOffset = (timezone) => {
  const now = new Date()
  const tzString = now.toLocaleString('en-US', { timeZone: timezone })
  const localString = now.toLocaleString('en-US')
  const diff = (Date.parse(tzString) - Date.parse(localString)) / 3600000
  return diff
}

export const searchCities = (query) => {
  const lowerQuery = query.toLowerCase()
  return worldCities.filter(
    city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  )
}

export const getCityByCoordinates = (lat, lng) => {
  // Find the closest city to the clicked coordinates
  let closestCity = worldCities[0]
  let minDistance = Infinity

  worldCities.forEach(city => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    )
    if (distance < minDistance) {
      minDistance = distance
      closestCity = city
    }
  })

  return closestCity
}
