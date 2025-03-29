import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get Bitcoin exchange rates against other currencies
 */
class ExchangeRatesTool extends MCPTool<{}> {
  name = "CoinGecko_exchange_rates";
  description = "Get Bitcoin exchange rates against various fiat and cryptocurrency denominations.";
  
  schema = {};

  async execute() {
    try {
      const ratesData = await coinGeckoService.getExchangeRates();
      
      return {
        success: true,
        data: ratesData.rates
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default ExchangeRatesTool; 