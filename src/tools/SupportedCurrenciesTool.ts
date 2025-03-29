import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get list of supported currencies
 */
class SupportedCurrenciesTool extends MCPTool<{}> {
  name = "CoinGecko_supported_currencies";
  description = "Get a list of all supported currency codes (fiat and crypto) that can be used when querying prices.";
  
  schema = {};

  async execute() {
    try {
      const currencies = await coinGeckoService.getSupportedCurrencies();
      
      return {
        success: true,
        data: currencies
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default SupportedCurrenciesTool; 