import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface ExchangeByIdInput {
  exchangeId: string;
}

/**
 * MCP Tool to get data for a specific exchange
 */
class ExchangeByIdTool extends MCPTool<ExchangeByIdInput> {
  name = "CoinGecko_exchange_by_id";
  description = "Get detailed data for a specific cryptocurrency exchange by its ID.";
  
  schema = {
    exchangeId: {
      type: z.string(),
      description: "The ID of the exchange (e.g., 'binance', 'coinbase')",
    },
  };

  async execute({ exchangeId }: ExchangeByIdInput) {
    try {
      if (!exchangeId) {
        return {
          success: false,
          error: "Exchange ID must be provided"
        };
      }

      const exchangeData = await coinGeckoService.getExchangeById(exchangeId);
      
      return {
        success: true,
        data: exchangeData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default ExchangeByIdTool; 