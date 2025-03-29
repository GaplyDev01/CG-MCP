import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get a list of all available coins from CoinGecko
 */
class CoinListTool extends MCPTool<{}> {
  name = "CoinGecko_coin_list";
  description = "Get a list of all coins available on CoinGecko with their ids, names, and symbols.";
  
  schema = {};

  async execute() {
    try {
      const coins = await coinGeckoService.getCoins();
      
      return {
        success: true,
        data: coins.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CoinListTool; 