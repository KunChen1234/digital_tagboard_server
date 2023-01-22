import { IncomingMessage, ServerResponse } from "http";
import { logger } from "./index";

/**
 * Callback for incoming HTTP requests. Defaults to returning 404
 * @param req request object from client
 * @param res server response
 */
export function httpCB(req: IncomingMessage, res: ServerResponse): void {
	// Callback for receiving an HTTP request
	// Default behaviour is to return error code 404
	logger.info(`${new Date()} Received request for ${req.url}`);
	// res.writeHead(404, headers);
	res.writeHead(404);
	res.end();
}
