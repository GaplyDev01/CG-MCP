import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get global cryptocurrency market data
 */
class GlobalMarketTool extends MCPTool<{}> {
  name = "CoinGecko_global_market";
  description = "Get global cryptocurrency market data including market cap, volume, market cap percentage by coin, etc.";
  
  schema = {};

  async execute() {
    try {
      const globalData = await coinGeckoService.getGlobalMarketData();
      
      // Extract and format data for better readability
      const { data } = globalData;
      
      const formattedData = {
        active_cryptocurrencies: data.active_cryptocurrencies,
        markets: data.markets,
        market_cap_change_percentage_24h_usd: data.market_cap_change_percentage_24h_usd,
        total_market_cap: data.total_market_cap,
        total_volume: data.total_volume,
        market_cap_percentage: data.market_cap_percentage,
        updated_at: data.updated_at
      };
      
      return {
        success: true,
        data: formattedData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default GlobalMarketTool; 