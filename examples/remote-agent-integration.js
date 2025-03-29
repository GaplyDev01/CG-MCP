/**
 * Example script showing how to integrate with a remote CoinGecko MCP server
 * from an agent running on a different server.
 *
 * Prerequisites:
 * - Node.js
 * - npm install node-fetch (or use built-in fetch for Node.js 18+)
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class RemoteMCPClient {
  constructor(serverUrl, apiKey = null) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
  }

  /**
   * Get common headers for requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }
    
    return headers;
  }

  /**
   * List all available tools on the MCP server
   */
  async listTools() {
    const response = await fetch(`${this.serverUrl}/rpc`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'listTools',
        params: {},
        id: 1,
      }),
    });

    return await response.json();
  }

  /**
   * Call a specific tool on the MCP server
   */
  async callTool(toolName, params = {}) {
    const response = await fetch(`${this.serverUrl}/rpc`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'callTool',
        params: {
          name: toolName,
          arguments: params,
        },
        id: 2,
      }),
    });

    return await response.json();
  }
}

// Example usage
async function main() {
  // Replace with your actual VPS IP or domain and API key
  const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://your-vps-ip:8080';
  const MCP_API_KEY = process.env.MCP_API_KEY; // Optional
  
  const mcpClient = new RemoteMCPClient(MCP_SERVER_URL, MCP_API_KEY);
  
  try {
    // List all available tools
    console.log('Listing available tools...');
    const toolsResponse = await mcpClient.listTools();
    
    // Check for authentication errors
    if (toolsResponse.error && toolsResponse.error.code === -32000) {
      console.error('Authentication failed. Please check your API key.');
      return;
    }
    
    console.log('Available tools:', toolsResponse.result.tools.map(tool => tool.name));
    
    // Get trending coins
    console.log('\nFetching trending coins...');
    const trendingResponse = await mcpClient.callTool('CoinGecko_trending_coins');
    if (trendingResponse.result && trendingResponse.result.success) {
      const trendingCoins = trendingResponse.result.data.coins;
      console.log('Top trending coins:');
      trendingCoins.slice(0, 5).forEach(coin => {
        console.log(`- ${coin.name} (${coin.symbol}) - Rank: ${coin.market_cap_rank}`);
      });
    } else {
      console.error('Error fetching trending coins:', trendingResponse.error || trendingResponse.result?.error);
    }
    
    // Get Bitcoin price
    console.log('\nFetching Bitcoin price...');
    const priceResponse = await mcpClient.callTool('CoinGecko_coin_price', {
      coinIds: ['bitcoin', 'ethereum'],
      currencies: ['usd', 'eur']
    });
    if (priceResponse.result && priceResponse.result.success) {
      const priceData = priceResponse.result.data;
      console.log('Bitcoin price:', priceData.bitcoin.usd, 'USD,', priceData.bitcoin.eur, 'EUR');
      console.log('Ethereum price:', priceData.ethereum.usd, 'USD,', priceData.ethereum.eur, 'EUR');
    } else {
      console.error('Error fetching price data:', priceResponse.error || priceResponse.result?.error);
    }
  } catch (error) {
    console.error('Error connecting to MCP server:', error);
  }
}

main().catch(console.error); 