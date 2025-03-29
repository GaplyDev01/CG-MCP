import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get list of all exchanges
 */
class ExchangesTool extends MCPTool<{}> {
  name = "CoinGecko_exchanges";
  description = "Get a list of all cryptocurrency exchanges with their basic data on CoinGecko.";
  
  schema = {};

  async execute() {
    try {
      const exchanges = await coinGeckoService.getExchanges();
      
      return {
        success: true,
        data: exchanges
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default ExchangesTool; 