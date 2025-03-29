import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface SearchInput {
  query: string;
}

/**
 * MCP Tool to search for coins, categories, and markets
 */
class SearchTool extends MCPTool<SearchInput> {
  name = "CoinGecko_search";
  description = "Search for coins, categories, and markets by name or symbol.";
  
  schema = {
    query: {
      type: z.string(),
      description: "The search query string",
    },
  };

  async execute({ query }: SearchInput) {
    try {
      if (!query) {
        return {
          success: false,
          error: "Search query must be provided"
        };
      }

      const searchData = await coinGeckoService.search(query);
      
      return {
        success: true,
        data: searchData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default SearchTool; 