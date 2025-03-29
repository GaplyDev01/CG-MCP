import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get global DeFi market data
 */
class GlobalDefiTool extends MCPTool<{}> {
  name = "CoinGecko_global_defi";
  description = "Get global decentralized finance (DeFi) market data including total market cap, trading volume, and more.";
  
  schema = {};

  async execute() {
    try {
      const defiData = await coinGeckoService.getGlobalDefiData();
      
      return {
        success: true,
        data: defiData.data
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default GlobalDefiTool; 