import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get list of all coin categories
 */
class CoinCategoriesTool extends MCPTool<{}> {
  name = "CoinGecko_coin_categories";
  description = "Get a list of all cryptocurrency categories on CoinGecko (e.g., DeFi, NFT, Metaverse).";
  
  schema = {};

  async execute() {
    try {
      const categories = await coinGeckoService.getCoinCategories();
      
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinCategoriesTool; 