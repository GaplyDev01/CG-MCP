import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

/**
 * MCP Tool to get list of all asset platforms (blockchains)
 */
class AssetPlatformsTool extends MCPTool<{}> {
  name = "CoinGecko_asset_platforms";
  description = "Get a list of all blockchain networks (asset platforms) on CoinGecko.";
  
  schema = {};

  async execute() {
    try {
      const platforms = await coinGeckoService.getAssetPlatforms();
      
      return {
        success: true,
        data: platforms
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default AssetPlatformsTool; 