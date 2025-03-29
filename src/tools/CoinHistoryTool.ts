import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinHistoryInput {
  coinId: string;
  date: string;
  localization?: boolean;
}

/**
 * MCP Tool to get historical data for a coin on a specific date
 */
class CoinHistoryTool extends MCPTool<CoinHistoryInput> {
  name = "CoinGecko_coin_history";
  description = "Get historical data (price, market cap, volume) for a specific cryptocurrency on a given date.";
  
  schema = {
    coinId: {
      type: z.string(),
      description: "The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum')",
    },
    date: {
      type: z.string(),
      description: "Date in DD-MM-YYYY format (e.g., '30-12-2022')",
    },
    localization: {
      type: z.boolean().optional().default(false),
      description: "Include localized data (default: false)",
    },
  };

  async execute({ coinId, date, localization = false }: CoinHistoryInput) {
    try {
      if (!coinId) {
        return {
          success: false,
          error: "Coin ID must be provided"
        };
      }

      if (!date) {
        return {
          success: false,
          error: "Date must be provided in DD-MM-YYYY format"
        };
      }

      const historyData = await coinGeckoService.getCoinHistory(coinId, date, localization);
      
      return {
        success: true,
        data: historyData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinHistoryTool; 