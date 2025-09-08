import { ExternalSourceResult, SourceKey } from '../types.js';
import { CONFIG } from '../config.js';

export async function fetchOpenWeather(query: string): Promise<ExternalSourceResult> {
  const m = query.match(/weather\s+in\s+([a-z\s]+)/i);
  const city = m?.[1]?.trim() || null;
  
  if (!city) {
    console.log('🌤️ No city found in weather query');
    return { key: 'openweather' as SourceKey, title: 'OpenWeather', used: false, items: [] };
  }

  if (!CONFIG.OPENWEATHER_API_KEY) {
    console.warn('⚠️ OpenWeather API key not configured');
    return { key: 'openweather' as SourceKey, title: 'OpenWeather', used: false, items: [] };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`;

  console.log(`🌤️ Fetching weather for ${city}`);

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`❌ OpenWeather API error: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error(`Response: ${errorText}`);
      return { key: 'openweather', title: 'OpenWeather', used: false, items: [] };
    }

    const data = await res.json() as any;
    console.log(`✅ Weather data received for ${city}`);

    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    return {
      key: 'openweather' as SourceKey,
      title: 'OpenWeather',
      used: true,
      items: [
        {
          title: `Weather in ${data.name}, ${data.sys.country}`,
          snippet: `${temp}°C, ${description}, Humidity: ${humidity}%, Wind: ${windSpeed} m/s`,
          data: { 
            temperature: temp, 
            description, 
            humidity, 
            windSpeed,
            city: data.name,
            country: data.sys.country
          }
        }
      ]
    };
  } catch (error) {
    console.error(`❌ Weather API fetch error:`, error);
    return { key: 'openweather', title: 'OpenWeather', used: false, items: [] };
  }
}