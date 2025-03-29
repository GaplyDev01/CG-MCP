#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Check if MCP Inspector is installed, install if not
if ! npx @modelcontextprotocol/inspector --version &> /dev/null; then
  echo "MCP Inspector not found. Installing..."
  npm install -g @modelcontextprotocol/inspector
fi

# Run the server with MCP Inspector
echo "Starting MCP Inspector with CoinGecko MCP server..."
npx @modelcontextprotocol/inspector dist/index.js 