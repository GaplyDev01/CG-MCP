import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinTickersInput {
  coinId: string;
  includeExchangeLogos?: boolean;
  page?: number;
}

/**
 * MCP Tool to get ticker data (trading pairs) for a specific cryptocurrency
 */
class CoinTickersTool extends MCPTool<CoinTickersInput> {
  name = "CoinGecko_coin_tickers";
  description = "Get trading pairs (tickers) for a specific cryptocurrency across exchanges.";
  
  schema = {
    coinId: {
      type: z.string(),
      description: "The ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum')",
    },
    includeExchangeLogos: {
      type: z.boolean().optional().default(false),
      description: "Include exchange logos in the response (default: false)",
    },
    page: {
      type: z.number().int().positive().optional().default(1),
      description: "Page number for paginated results (default: 1)",
    },
  };

  async execute({ coinId, includeExchangeLogos = false, page = 1 }: CoinTickersInput) {
    try {
      if (!coinId) {
        return {
          success: false,
          error: "Coin ID must be provided"
        };
      }

      const tickersData = await coinGeckoService.getCoinTickers(coinId, includeExchangeLogos, page);
      
      return {
        success: true,
        data: {
          name: tickersData.name,
          tickers: tickersData.tickers,
          page: page
        }
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinTickersTool; 