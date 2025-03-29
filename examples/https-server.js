/**
 * Example HTTPS proxy for the MCP server
 * This creates a secure layer in front of the MCP server for production use
 * 
 * Prerequisites:
 * - Node.js
 * - npm install express http-proxy-middleware
 * - SSL certificate and key files
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 443;
const TARGET = process.env.MCP_TARGET || 'http://localhost:8080';
const API_KEY = process.env.MCP_API_KEY;

// SSL certificate files - replace with paths to your actual certificate files
const SSL_KEY = process.env.SSL_KEY || path.join(__dirname, 'ssl', 'privkey.pem');
const SSL_CERT = process.env.SSL_CERT || path.join(__dirname, 'ssl', 'fullchain.pem');

// Create Express app
const app = express();

// Add API key authentication middleware (optional)
app.use((req, res, next) => {
  if (!API_KEY) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing API key'
    });
  }
  
  next();
});

// Create proxy middleware in front of the MCP server
const proxyOptions = {
  target: TARGET,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // Optionally rewrite paths
  },
  // Add custom headers to the proxied request
  onProxyReq: (proxyReq, req, res) => {
    // If your MCP server has its own API key requirement, you can forward it
    if (process.env.UPSTREAM_API_KEY) {
      proxyReq.setHeader('x-api-key', process.env.UPSTREAM_API_KEY);
    }
  },
  // Log proxied requests
  logLevel: 'info'
};

app.use('/', createProxyMiddleware(proxyOptions));

// Create HTTPS server with your SSL certificates
try {
  const httpsOptions = {
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS proxy for MCP server running on port ${PORT}`);
    console.log(`Proxying requests to ${TARGET}`);
  });
} catch (error) {
  console.error('Error starting HTTPS server:', error.message);
  console.log('Falling back to HTTP mode (not recommended for production)');
  
  app.listen(8443, () => {
    console.log(`HTTP proxy for MCP server running on port 8443`);
    console.log(`Proxying requests to ${TARGET}`);
    console.log('WARNING: Using HTTP is not secure for production environments');
  });
} 