/**
 * Simple API key authentication middleware for the MCP server
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to validate API key
 * Can be used when the MCP server is exposed remotely
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth if no API key is configured
  if (!process.env.MCP_API_KEY) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.MCP_API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing API key'
    });
  }
  
  next();
}; 