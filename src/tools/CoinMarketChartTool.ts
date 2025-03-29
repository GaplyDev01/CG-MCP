import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinMarketChartInput {
  coinId: string;
  days: number;
  currency?: string;
}

/**
 * MCP Tool to get historical market chart data for a specific cryptocurrency
 */
class CoinMarketChartTool extends MCPTool<CoinMarketChartInput> {
  name = "CoinGecko_coin_market_chart";
  description = "Get historical market data (price, market cap, volume) for a specific cryptocurrency over a specified time period.";
  
  schema = {
    coinId: {
      type: z.string(),
      description: "The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum')",
    },
    days: {
      type: z.number().positive().min(1).max(365),
      description: "Number of days of data to return (1-365)",
    },
    currency: {
      type: z.string().optional().default("usd"),
      description: "The currency to get market data in (e.g., 'usd', 'eur', 'btc')",
    },
  };

  async execute({ coinId, days, currency = "usd" }: CoinMarketChartInput) {
    try {
      if (!coinId) {
        return {
          success: false,
          error: "Coin ID must be provided"
        };
      }

      const chartData = await coinGeckoService.getMarketChart(coinId, days, currency);
      
      // Process the data to make it more usable
      const processedData = {
        prices: chartData.prices.map((entry: [number, number]) => ({
          timestamp: entry[0],
          price: entry[1]
        })),
        market_caps: chartData.market_caps.map((entry: [number, number]) => ({
          timestamp: entry[0],
          market_cap: entry[1]
        })),
        total_volumes: chartData.total_volumes.map((entry: [number, number]) => ({
          timestamp: entry[0],
          volume: entry[1]
        })),
      };
      
      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinMarketChartTool; 