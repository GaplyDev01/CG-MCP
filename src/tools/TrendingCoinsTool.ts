import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get trending cryptocurrencies
 */
class TrendingCoinsTool extends MCPTool<{}> {
  name = "CoinGecko_trending_coins";
  description = "Get a list of trending cryptocurrencies on CoinGecko in the last 24 hours.";
  
  schema = {};

  async execute() {
    try {
      const trendingData = await coinGeckoService.getTrendingCoins();
      
      // Extract and format data for better readability
      const trendingCoins = trendingData.coins.map((item: any) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol,
        market_cap_rank: item.item.market_cap_rank,
        score: item.item.score,
        thumb: item.item.thumb,
        large: item.item.large
      }));
      
      return {
        success: true,
        data: {
          coins: trendingCoins,
          timestamp: new Date().toISOString()
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

export default TrendingCoinsTool; 