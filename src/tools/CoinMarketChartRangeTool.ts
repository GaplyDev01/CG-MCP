import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinMarketChartRangeInput {
  coinId: string;
  from: number;
  to: number;
  currency?: string;
}

/**
 * MCP Tool to get historical market chart data for a specific cryptocurrency within a date range
 */
class CoinMarketChartRangeTool extends MCPTool<CoinMarketChartRangeInput> {
  name = "CoinGecko_coin_market_chart_range";
  description = "Get historical market data (price, market cap, volume) for a specific cryptocurrency within a date range using UNIX timestamps.";
  
  schema = {
    coinId: {
      type: z.string(),
      description: "The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum')",
    },
    from: {
      type: z.number().int().positive(),
      description: "From date in UNIX timestamp (seconds)",
    },
    to: {
      type: z.number().int().positive(),
      description: "To date in UNIX timestamp (seconds)",
    },
    currency: {
      type: z.string().optional().default("usd"),
      description: "The currency to get market data in (e.g., 'usd', 'eur', 'btc')",
    },
  };

  async execute({ coinId, from, to, currency = "usd" }: CoinMarketChartRangeInput) {
    try {
      if (!coinId) {
        return {
          success: false,
          error: "Coin ID must be provided"
        };
      }

      if (!from || !to) {
        return {
          success: false,
          error: "Both 'from' and 'to' UNIX timestamps must be provided"
        };
      }

      const chartData = await coinGeckoService.getMarketChartRange(coinId, from, to, currency);
      
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

export default CoinMarketChartRangeTool; 