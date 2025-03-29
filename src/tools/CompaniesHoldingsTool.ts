import { MCPTool } from "mcp-framework";
import { z } from "zod";
import coinGeckoService from "../services/CoinGeckoService";

interface CompaniesHoldingsInput {
  coinId?: string;
}

/**
 * MCP Tool to get public companies Bitcoin or Ethereum holdings
 */
class CompaniesHoldingsTool extends MCPTool<CompaniesHoldingsInput> {
  name = "CoinGecko_companies_holdings";
  description = "Get public companies' Bitcoin or Ethereum holdings data.";
  
  schema = {
    coinId: {
      type: z.string().optional().default("bitcoin"),
      description: "The cryptocurrency to get holdings for (e.g., 'bitcoin', 'ethereum')",
    },
  };

  async execute({ coinId = "bitcoin" }: CompaniesHoldingsInput) {
    try {
      if (coinId !== "bitcoin" && coinId !== "ethereum") {
        return {
          success: false,
          error: "Only 'bitcoin' and 'ethereum' are supported for companies holdings data"
        };
      }

      const holdingsData = await coinGeckoService.getCompaniesHoldings(coinId);
      
      return {
        success: true,
        data: holdingsData
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export default CompaniesHoldingsTool; 