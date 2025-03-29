import { MCPServer } from "mcp-framework";

// Initialize MCP Server with SSE transport for remote access
const server = new MCPServer({
  name: "coingecko-mcp",
  version: "1.0.0",
  transport: {
    type: "sse",
    options: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
      // Add CORS support for remote clients
      cors: {
        origin: "*", // In production, restrict this to your agent's domain
        methods: ["GET", "POST"]
      }
    }
  }
});

// Start the server
server.start()
  .then(() => {
    const port = process.env.PORT || 8080;
    console.log(`CoinGecko MCP Server started successfully on port ${port}`);
    console.log(`Server is accessible at http://your-vps-ip:${port}`);
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  }); 