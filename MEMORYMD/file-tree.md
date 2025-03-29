# CoinGecko MCP Framework - File Tree

## Project Structure

```
coingecko-mcp/
├── dist/                     # Compiled TypeScript code (generated)
├── src/
│   ├── services/             # Service layer for API interactions
│   │   └── CoinGeckoService.ts  # CoinGecko API service
│   ├── tools/                # MCP Tools implementations
│   │   ├── AssetPlatformsTool.ts # Tool to get list of blockchain platforms
│   │   ├── CoinCategoriesTool.ts # Tool to get list of coin categories
│   │   ├── CoinHistoryTool.ts    # Tool to get historical data for a coin
│   │   ├── CoinListTool.ts       # Tool to get list of all coins
│   │   ├── CoinMarketChartRangeTool.ts # Tool to get market chart data in range
│   │   ├── CoinMarketChartTool.ts # Tool to get historical data
│   │   ├── CoinOHLCTool.ts       # Tool to get OHLC data
│   │   ├── CoinPriceTool.ts      # Tool to get current prices
│   │   ├── CoinTickersTool.ts    # Tool to get coin tickers
│   │   ├── CompaniesHoldingsTool.ts # Tool to get companies' crypto holdings
│   │   ├── ExchangeByIdTool.ts   # Tool to get exchange data by ID
│   │   ├── ExchangeRatesTool.ts  # Tool to get BTC exchange rates
│   │   ├── ExchangesTool.ts      # Tool to get list of exchanges
│   │   ├── GlobalDefiTool.ts     # Tool to get global DeFi data
│   │   ├── GlobalMarketTool.ts   # Tool to get global market data
│   │   ├── SearchTool.ts         # Tool to search for coins, markets, etc.
│   │   ├── SupportedCurrenciesTool.ts # Tool to get supported currencies
│   │   └── TrendingCoinsTool.ts  # Tool to get trending coins
│   └── index.ts              # Main server entry point
├── MEMORYMD/                 # Documentation directory
│   ├── file-tree.md          # This file - project structure
│   ├── dev-notes.md          # Technical implementation details
│   └── task-log.md           # Task tracking and statuses
├── README.md                 # Project documentation
├── package.json              # NPM package configuration
└── tsconfig.json             # TypeScript configuration
```

## Component Organization

### Service Layer

The service layer handles direct interaction with the CoinGecko API and manages:
- API request formatting
- Error handling
- Rate limiting concerns
- Response normalization

### MCP Tools

Each tool represents a specific capability exposed to the MCP client:

| **Tool Name**                 | **Purpose**                               | **API Endpoint**                 |
|-------------------------------|-------------------------------------------|----------------------------------|
| CoinGecko_asset_platforms     | Get list of blockchain platforms          | /asset_platforms                 |
| CoinGecko_coin_categories     | Get list of coin categories               | /coins/categories/list           |
| CoinGecko_coin_history        | Get historical data for a specific date   | /coins/{id}/history              |
| CoinGecko_coin_list           | Get all available cryptocurrencies        | /coins/list                      |
| CoinGecko_coin_market_chart   | Get historical price/market data          | /coins/{id}/market_chart         |
| CoinGecko_coin_market_chart_range | Get historical data in date range     | /coins/{id}/market_chart/range   |
| CoinGecko_coin_ohlc           | Get OHLC candlestick data                 | /coins/{id}/ohlc                 |
| CoinGecko_coin_price          | Get current prices                        | /simple/price                    |
| CoinGecko_coin_tickers        | Get trading pairs for a coin              | /coins/{id}/tickers              |
| CoinGecko_companies_holdings  | Get companies' crypto holdings            | /companies/public_treasury/{id}  |
| CoinGecko_exchange_by_id      | Get specific exchange data                | /exchanges/{id}                  |
| CoinGecko_exchange_rates      | Get BTC exchange rates                    | /exchange_rates                  |
| CoinGecko_exchanges           | Get list of all exchanges                 | /exchanges                       |
| CoinGecko_global_defi         | Get global DeFi market statistics         | /global/decentralized_finance_defi |
| CoinGecko_global_market       | Get global market statistics              | /global                          |
| CoinGecko_search              | Search for coins, markets, etc.           | /search                          |
| CoinGecko_supported_currencies | Get list of supported currencies          | /simple/supported_vs_currencies  |
| CoinGecko_trending_coins      | Get trending cryptocurrencies             | /search/trending                 |

### Main Server

The `index.ts` file initializes and starts the MCP server with automatic tool discovery.

## Dependencies

The project relies on the following key dependencies:

| **Dependency**   | **Purpose**                                       | **Version** |
|------------------|---------------------------------------------------|-------------|
| mcp-framework    | Core MCP Framework for tool integration           | ^0.2.5      |
| axios            | HTTP client for API requests                      | ^1.6.0      |
| zod              | Schema validation for tool parameters             | ^3.22.4     |
| typescript       | Static typing and compilation                     | ^5.2.2      |

## Performance Metrics

### API Call Volume Estimates

- Free tier: Maximum 50 calls/minute
- Pro tier: Higher limits based on plan
- Recommend implementing caching for frequent requests

### Tool-Specific Performance

| **Tool**                      | **Avg. Response Time** | **Response Size** | **Rate Limit Impact** |
|-------------------------------|------------------------|-------------------|----------------------|
| CoinGecko_coin_list           | ~800ms                 | Large (300KB+)    | High                 |
| CoinGecko_coin_price          | ~400ms                 | Small             | Low                  |
| CoinGecko_coin_market_chart   | ~600ms                 | Medium-Large      | Medium               |
| CoinGecko_global_market       | ~300ms                 | Small             | Low                  |
| CoinGecko_trending_coins      | ~350ms                 | Small             | Low                  |
| CoinGecko_search              | ~500ms                 | Medium            | Low                  |
| CoinGecko_coin_tickers        | ~550ms                 | Medium            | Medium               |
| CoinGecko_coin_ohlc           | ~450ms                 | Medium            | Low                  | 