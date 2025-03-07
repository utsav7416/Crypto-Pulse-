export const CoinList = (currency) =>
    `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  
  export const SingleCoin = (id) =>
    `/api/coins/${id}`;
  
  export const HistoricalChart = (id, days = 365, currency) =>
    `/api/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  
  export const TrendingCoins = (currency) =>
    `/api/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
  