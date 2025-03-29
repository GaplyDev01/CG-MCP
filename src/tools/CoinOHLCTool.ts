import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinOHLCInput {
  coinId: string;
  days?: number;
  currency?: string;
}

/**
 * MCP Tool to get OHLC (Open, High, Low, Close) data for a specific cryptocurrency
 */
class CoinOHLCTool extends MCPTool<CoinOHLCInput> {
  name = "CoinGecko_coin_ohlc";
  description = "Get OHLC (Open, High, Low, Close) data for a specific cryptocurrency over a specified time period.";
  
  schema = {
    coinId: {
      type: z.string(),
      description: "The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum')",
    },
    days: {
      type: z.number().int().positive().max(365).optional().default(1),
      description: "Number of days of data to return (1-365, default: 1)",
    },
    currency: {
      type: z.string().optional().default("usd"),
      description: "The currency to get OHLC data in (e.g., 'usd', 'eur', 'btc')",
    },
  };

  async execute({ coinId, days = 1, currency = "usd" }: CoinOHLCInput) {
    try {
      if (!coinId) {
        return {
          success: false,
          error: "Coin ID must be provided"
        };
      }

      const ohlcData = await coinGeckoService.getOHLC(coinId, days, currency);
      
      // Process the data to make it more usable
      const processedData = ohlcData.map((entry: [number, number, number, number, number]) => ({
        timestamp: entry[0],
        open: entry[1],
        high: entry[2],
        low: entry[3],
        close: entry[4]
      }));
      
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

export default CoinOHLCTool; 