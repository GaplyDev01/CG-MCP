# CoinGecko MCP Framework - Development Notes

## Implementation Details

### API Service Implementation

The `CoinGeckoService` class implements a singleton pattern to manage interactions with the CoinGecko API:

- API base URL: `https://api.coingecko.com/api/v3`
- Optional API key support via environment variable
- Axios instance with proper timeout and header configuration
- Comprehensive error handling and formatting

```json
// Header Configuration
{
  "Accept": "application/json",
  "x-cg-pro-api-key": "API_KEY" // Only if provided
}
```

### MCP Server Configuration

The MCP Framework (version 0.2.5) used in this project has the following characteristics:

- Automatic tool discovery from the `src/tools` directory
- STDIO transport by default for command-line integration
- Simple configuration with name and version

```typescript
// Server configuration
const server = new MCPServer({
  name: "coingecko-mcp",
  version: "1.0.0"
});
```

### Rate Limiting Strategy

CoinGecko's free API tier has strict rate limits (10-50 calls/minute). Our implementation:

1. Detects 429 (Too Many Requests) responses via Axios interceptors
2. Logs warnings when rate limits are hit
3. Passes formatted errors up to the calling tool

Future enhancements should include:
- Request throttling/queuing
- Response caching
- Automatic retry with backoff

### Error Handling

All API calls are wrapped in try/catch blocks with standardized error handling:

```typescript
try {
  // API call
} catch (error) {
  return {
    success: false,
    error: (error as Error).message
  };
}
```

Error objects include:
- HTTP status code (when available)
- Error message from API response
- Request context information

### Configuration Management

The service accepts an API key via:
- Constructor parameter
- Environment variable: `COINGECKO_API_KEY`

## API Response Processing

Each tool processes API responses to provide a consistent and useful format:

### Core Tools

#### CoinListTool
- Maps the response to extract only essential fields: id, symbol, name

#### CoinPriceTool
- Returns raw price data with nested currency information
- Includes market_cap, 24h_vol, and 24h_change when available

#### CoinMarketChartTool
- Restructures the array data into objects with named properties
- Maps timestamp/value tuples to more readable objects

#### GlobalMarketTool
- Extracts only the most relevant global market metrics
- Standardizes response format for easier consumption

#### TrendingCoinsTool
- Flattens nested item structures
- Includes timestamp for context

### Additional Tools

#### Historical and Chart Data Tools
- **CoinHistoryTool**: Retrieves point-in-time data for a specific date
- **CoinMarketChartRangeTool**: Gets data within custom date ranges with timestamp validation
- **CoinOHLCTool**: Transforms OHLC array tuples into structured objects

#### Global and Reference Data Tools
- **GlobalDefiTool**: Extracts DeFi market statistics
- **ExchangeRatesTool**: Provides BTC exchange rates against other currencies
- **SupportedCurrenciesTool**: Lists all supported currency codes
- **AssetPlatformsTool**: Returns all supported blockchain networks
- **CoinCategoriesTool**: Provides coin category metadata

#### Search and Discovery Tools
- **SearchTool**: General-purpose search with results categorized by type
- **CoinTickersTool**: Exchange-specific data for a given coin

#### Exchange Tools
- **ExchangesTool**: Comprehensive exchange listings
- **ExchangeByIdTool**: Detailed individual exchange data

#### Specialized Tools
- **CompaniesHoldingsTool**: Public companies' Bitcoin/Ethereum holdings

## Performance Considerations

### Memory Usage

The `/coins/list` endpoint returns a large dataset (~300KB+). Considerations:
- The tool processes this data efficiently with array mapping
- Future enhancement: Pagination support for large datasets

### Response Time Optimization

Market chart data can be substantial for longer time periods:
- For large day ranges, the server may need increased timeout settings
- Future enhancement: Progressive data loading for large time spans

## Technical Decisions

1. **Singleton Service Pattern**
   - Pros: Ensures consistent API client across all tools
   - Cons: Less flexible for testing; future enhancement would be to support DI

2. **Zod Schema Validation**
   - Provides strong runtime validation for tool parameters
   - Ensures proper documentation of parameter requirements

3. **TypeScript Interface Definitions**
   - Each tool has a properly typed input interface
   - Response data structures use type assertions where needed

4. **Error Classification**
   - Distinguishes between API errors, network errors, and configuration errors
   - Future enhancement: Add error codes for client categorization

5. **Automatic Tool Discovery**
   - Leverages MCP Framework's built-in tool loader
   - Makes adding new tools simpler - just add them to the `src/tools` directory

6. **Consistent Response Format**
   - All tools use the same success/error response format
   - Data is transformed for readability while preserving original structure where beneficial

## Testing the MCP Server

A convenience script `src/run-mcp.sh` is provided to:
1. Build the TypeScript code
2. Launch the MCP server with the MCP Inspector
3. Provide an interactive interface for testing the tools

## Future Enhancements

1. **Caching Layer**
   - Implement Redis or in-memory caching for frequently requested data
   - Apply different TTL values based on data volatility

2. **Webhook Support**
   - Add price alert capabilities via webhooks
   - Enable subscription to price updates

3. **Batch Operations**
   - Support for batched requests to reduce API call volume
   - Combine similar requests within timeframes

4. **Automated Testing**
   - Unit tests for parameter validation
   - Integration tests with API mocking

5. **Extended API Coverage**
   - Add support for derivatives markets
   - Add NFT market data
   - Implement historical global market cap charts 