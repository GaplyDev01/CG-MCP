# Connecting Remote Agents to CoinGecko MCP Server

This guide explains how to connect your AI agents to the CoinGecko MCP server running on a VPS.

## Connection Options

The MCP server exposes its tools via SSE (Server-Sent Events) transport, which makes it accessible over HTTP.

## Client Setup

### Option 1: Direct Integration with MCP Client Library

If your agent uses a Node.js-based MCP client library, you can connect directly:

```javascript
import { MCPClient } from "mcp-client"; // This is an example, use the appropriate MCP client library

// Connect to the remote MCP server
const client = new MCPClient({
  serverUrl: "http://your-vps-ip:8080", // Replace with your VPS IP or domain
  transport: "sse" // Use SSE transport to connect to the remote server
});

// Now you can use the client to call CoinGecko tools
const result = await client.callTool("CoinGecko_trending_coins");
console.log(result.data);
```

### Option 2: Using BeeAI Framework

If you're using the [BeeAI Framework](https://i-am-bee.github.io/beeai-framework) mentioned in the MCP documentation:

```javascript
import { MCPTool } from "beeai-framework/tools";

// Create a tool that connects to your remote MCP server
const coinGeckoTool = new MCPTool({
  serverUrl: "http://your-vps-ip:8080",
  toolName: "CoinGecko_trending_coins"
});

// Use the tool in your agent workflow
const trendingCoins = await coinGeckoTool.execute();
```

### Option 3: Using Claude or Other MCP-compatible LLMs

For Claude and other MCP-compatible LLM hosts, create a custom configuration that points to your remote server.

#### For Claude Desktop

Edit the Claude Desktop config file:

```json
{
  "mcpServers": {
    "remote-coingecko": {
      "url": "http://your-vps-ip:8080"
    }
  }
}
```

#### For Remote Agents

For remote agents that use Claude API, you'll need to implement a proxy that:

1. Receives tool call requests from Claude
2. Forwards them to your MCP server
3. Returns the results back to Claude

## Security Considerations

When exposing your MCP server publicly:

1. **Restrict CORS:** Update the CORS settings in the server to only allow requests from your agent's domain:

```typescript
cors: {
  origin: "https://your-agent-domain.com",
  methods: ["GET", "POST"]
}
```

2. **Add Authentication:** Consider adding basic auth or an API key requirement:

```typescript
// Example of how to add basic middleware for auth
// This would require modifying the server code
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

3. **Use HTTPS:** Set up HTTPS with a valid certificate for your server.

## Deployment Steps

1. Clone the repository on your VPS
2. Set up your environment variables (especially the `COINGECKO_API_KEY` if you have one)
3. Run with Docker Compose:

```bash
docker-compose up -d
```

4. Verify the server is running by accessing:
   - `http://your-vps-ip:8080`

## Testing the Connection

You can test if your MCP server is accessible using curl:

```bash
curl http://your-vps-ip:8080
```

This should return basic information about the available MCP tools. 