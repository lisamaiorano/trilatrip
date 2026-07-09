export interface DestinationInfo {
  country: string
  flag: string
  image: string
  currency: string
  language: string
  timezone: string
  bestSeason: string
  description: string
}

export const destinations: Record<string, DestinationInfo> = {
  Japan: {
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    currency: "JPY",
    language: "Japanese",
    timezone: "GMT+9",
    bestSeason: "March - April",
    description: "The land of the rising sun.",
  },

  Italy: {
    country: "Italy",
    flag: "🇮🇹",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    currency: "EUR",
    language: "Italian",
    timezone: "GMT+1",
    bestSeason: "April - June",
    description: "Art, history and food in every corner.",
  },

  France: {
    country: "France",
    flag: "🇫🇷",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    currency: "EUR",
    language: "French",
    timezone: "GMT+1",
    bestSeason: "May - September",
    description: "Romance, culture and world-class cuisine.",
  },

  Spain: {
    country: "Spain",
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1509845350456-6c30ea6d9a3d",
    currency: "EUR",
    language: "Spanish",
    timezone: "GMT+1",
    bestSeason: "May - June",
    description: "Sun, beaches and vibrant nightlife.",
  },

  "United States": {
    country: "United States",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    currency: "USD",
    language: "English",
    timezone: "Varies",
    bestSeason: "April - October",
    description: "From coast to coast, endless variety.",
  },
}



