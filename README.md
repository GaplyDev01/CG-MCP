# CoinGecko MCP Framework

A robust Model Context Protocol (MCP) Framework integration for the CoinGecko cryptocurrency API, providing tools to fetch and analyze cryptocurrency data.

## Features

- Complete CoinGecko API integration with 18+ specialized tools
- Support for local and remote server deployment 
- Secure access with API key authentication
- Docker support for easy deployment
- Comprehensive documentation and examples

## Quick Start

### Local Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

### Docker Deployment

Deploy on a VPS or any Docker-compatible environment:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coingecko-mcp.git
cd coingecko-mcp

# Build and start with Docker Compose
docker-compose up -d
```

## Configuration

### CoinGecko API Key

Set your CoinGecko API key in the docker-compose.yml file or as an environment variable:

```yaml
environment:
  - COINGECKO_API_KEY=your-api-key
```

### MCP Server Authentication

Secure your MCP server with an API key:

```yaml
environment:
  - MCP_API_KEY=your-mcp-api-key
```

## Accessing Remotely

The server uses SSE (Server-Sent Events) transport, making it accessible over HTTP:

- Local development: http://localhost:8080
- VPS deployment: http://your-vps-ip:8080

Include the API key in your requests:

```javascript
fetch('http://your-vps-ip:8080/rpc', {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-mcp-api-key'
  },
  // Additional request parameters
})
```

## Available Tools

The framework provides 18+ tools for accessing CoinGecko API endpoints:

- **CoinGecko_coin_list**: Get list of all cryptocurrencies
- **CoinGecko_coin_price**: Get current prices for specified cryptocurrencies
- **CoinGecko_coin_market_chart**: Get historical market data
- **CoinGecko_trending_coins**: Get trending cryptocurrencies
- **CoinGecko_global_market**: Get global market statistics
- And many more...

## Documentation

For detailed documentation, see:
- [client-integration.md](client-integration.md): Remote client integration guide
- [MEMORYMD/dev-notes.md](MEMORYMD/dev-notes.md): Technical implementation details
- [MEMORYMD/file-tree.md](MEMORYMD/file-tree.md): Project structure documentation

## Examples

Example scripts are available in the `examples/` directory:
- Remote agent integration
- HTTPS proxy setup
- Client authentication

## Security Considerations

For production use:
- Use HTTPS with a valid certificate
- Restrict CORS to authorized domains only
- Use a strong, random API key
- Consider implementing rate limiting

## License

ISC 