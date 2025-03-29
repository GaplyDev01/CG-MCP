import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CoinPriceInput {
  coinIds: string[];
  currencies?: string[];
}

/**
 * MCP Tool to get current prices of specified cryptocurrencies
 */
class CoinPriceTool extends MCPTool<CoinPriceInput> {
  name = "CoinGecko_coin_price";
  description = "Get current prices for the specified cryptocurrencies in the specified currencies, including market cap and 24h volume/change data.";
  
  schema = {
    coinIds: {
      type: z.array(z.string()),
      description: "Array of coin IDs to get prices for (e.g., 'bitcoin', 'ethereum')",
    },
    currencies: {
      type: z.array(z.string()).optional().default(["usd"]),
      description: "Array of currency codes to get prices in (e.g., 'usd', 'eur', 'btc')",
    },
  };

  async execute({ coinIds, currencies = ["usd"] }: CoinPriceInput) {
    try {
      if (!coinIds || coinIds.length === 0) {
        return {
          success: false,
          error: "At least one coin ID must be provided"
        };
      }

      const priceData = await coinGeckoService.getPrices(coinIds, currencies);
      
      return {
        success: true,
        data: priceData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinPriceTool; 