export function formatPrice(price: number){
    return (price).toLocaleString("en-US", {
        style: "currency",
        currency: "NGN",
    })
}

/*
import axios from 'axios';

const API_KEY = 'YOUR_EXCHANGE_RATE_API_KEY'; // Replace with your exchange rate API key
const BASE_CURRENCY = 'NGN'; // Base currency (Nigerian Naira)

async function getUserCurrency(): Promise<string> {
  // Use a free IP geolocation service to get the user's country code
  const { data } = await axios.get('https://ipapi.co/json/');
  return data.currency;
}

async function getExchangeRate(toCurrency: string): Promise<number> {
  // Fetch the exchange rate from NGN to the target currency
  const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
  return data.conversion_rates[toCurrency];
}

export async function formatPrice(price: number): Promise<string> {
  try {
    const userCurrency = await getUserCurrency();
    const exchangeRate = await getExchangeRate(userCurrency);
    const convertedPrice = (price / 100) * exchangeRate;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userCurrency,
    }).format(convertedPrice);
  } catch (error) {
    console.error('Error formatting price:', error);
    // Fallback to NGN if there's an error
    return (price / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: BASE_CURRENCY,
    });
  }
}


const priceInKobo = 150000; // Example price in kobo (Naira subunit)

formatPrice(priceInKobo).then(formattedPrice => {
  console.log('Formatted Price:', formattedPrice);
});

*/