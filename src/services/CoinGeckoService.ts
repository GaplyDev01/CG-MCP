import axios, { AxiosError, AxiosInstance } from "axios";

/**
 * Service for interacting with the CoinGecko API
 */
class CoinGeckoService {
  private readonly baseUrl: string = "https://api.coingecko.com/api/v3";
  private readonly client: AxiosInstance;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "Accept": "application/json",
        ...(this.apiKey && { "x-cg-pro-api-key": this.apiKey })
      }
    });
    
    // Add request interceptor for rate limiting
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          console.warn("Rate limit exceeded for CoinGecko API");
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Format error responses for better readability
   */
  private formatError(error: AxiosError): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const message = data?.error || data?.status?.error_message || error.message;
      
      return new Error(`CoinGecko API Error (${status}): ${message}`);
    }
    
    if (error.request) {
      return new Error(`CoinGecko API Request Error: No response received: ${error.message}`);
    }
    
    return new Error(`CoinGecko API Error: ${error.message}`);
  }

  /**
   * Get a list of all coins
   */
  async getCoins() {
    try {
      const response = await this.client.get("/coins/list");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current prices for specified coins in specified currencies
   */
  async getPrices(coinIds: string[], currencies: string[] = ["usd"]) {
    try {
      const response = await this.client.get("/simple/price", {
        params: {
          ids: coinIds.join(","),
          vs_currencies: currencies.join(","),
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get market chart data for a coin
   */
  async getMarketChart(coinId: string, days: number = 1, currency: string = "usd") {
    try {
      const response = await this.client.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get market chart data for a coin within a specific date range
   */
  async getMarketChartRange(coinId: string, from: number, to: number, currency: string = "usd") {
    try {
      const response = await this.client.get(`/coins/${coinId}/market_chart/range`, {
        params: {
          vs_currency: currency,
          from: from,
          to: to,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get OHLC data for a coin
   */
  async getOHLC(coinId: string, days: number = 1, currency: string = "usd") {
    try {
      const response = await this.client.get(`/coins/${coinId}/ohlc`, {
        params: {
          vs_currency: currency,
          days: days,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get historical data for a coin on a specific date
   */
  async getCoinHistory(coinId: string, date: string, localization: boolean = false) {
    try {
      const response = await this.client.get(`/coins/${coinId}/history`, {
        params: {
          date: date,
          localization: localization
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tickers for a coin
   */
  async getCoinTickers(coinId: string, includeExchangeLogos: boolean = false, page: number = 1) {
    try {
      const response = await this.client.get(`/coins/${coinId}/tickers`, {
        params: {
          include_exchange_logos: includeExchangeLogos,
          page: page
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get global cryptocurrency market data
   */
  async getGlobalMarketData() {
    try {
      const response = await this.client.get("/global");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get global DeFi market data
   */
  async getGlobalDefiData() {
    try {
      const response = await this.client.get("/global/decentralized_finance_defi");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins() {
    try {
      const response = await this.client.get("/search/trending");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates() {
    try {
      const response = await this.client.get("/exchange_rates");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search for coins, categories, and markets
   */
  async search(query: string) {
    try {
      const response = await this.client.get("/search", {
        params: {
          query: query
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of supported currencies
   */
  async getSupportedCurrencies() {
    try {
      const response = await this.client.get("/simple/supported_vs_currencies");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of all asset platforms (blockchains)
   */
  async getAssetPlatforms() {
    try {
      const response = await this.client.get("/asset_platforms");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of coin categories
   */
  async getCoinCategories() {
    try {
      const response = await this.client.get("/coins/categories/list");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of exchanges
   */
  async getExchanges() {
    try {
      const response = await this.client.get("/exchanges");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get exchange data by ID
   */
  async getExchangeById(exchangeId: string) {
    try {
      const response = await this.client.get(`/exchanges/${exchangeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get public companies bitcoin or ethereum holdings
   */
  async getCompaniesHoldings(coinId: string = "bitcoin") {
    try {
      const response = await this.client.get(`/companies/public_treasury/${coinId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export as singleton instance
export default new CoinGeckoService(process.env.COINGECKO_API_KEY); 