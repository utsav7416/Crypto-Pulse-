export const CoinList = (currency, perPage = 60, page = 1) =>
  `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

export const SingleCoin = (id) =>
  `/api/coins/${id}`;

export const HistoricalChart = (id, days = 90, currency) =>
  `/api/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;


export const TrendingCoins = (currency, perPage = 6, page = 1) =>
  `/api/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
