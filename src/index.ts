"use strict";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import { PrismaClient } from "@prisma/client";
import serverEvent from "./serverEvent/serverEvent";
import setLogger from "./logger";
import nodeConfig from "config";
import parser from "./args_parser";
import { connect, IClientOptions } from "mqtt";
import { connectMQTT, listenToMqtt } from "./mqtt";
import getDayShift from "../database/LoginList/getDayShift";
import getNightShift from "../database/LoginList/getNightShift";
import connectDb from "./IsdatabaseConnect";


const logger = setLogger("Main of Tagboard");
async function main() {
	setInterval(async () => {
		const dayShift = await getDayShift(prisma);



		if (dayShift != null) {
			const resultOfDayShift = dayShift;
			logger.debug("day shift", dayShift);
			logger.debug(dayShift);
			wsServer.emit("DayShifts", resultOfDayShift);
		}
		const nightShfit = await getNightShift(prisma);

		if (nightShfit != null) {
			const resultOfNightShift = nightShfit;
			logger.debug("night shift", nightShfit);
			logger.debug(nightShfit?.toString());
			wsServer.emit("NightShifts", resultOfNightShift);
		}
	}, 10000)
	const prisma = new PrismaClient();
	connectDb(prisma);
	const args = parser(process.argv);
	let tcpPort: number;
	if ((args.tcpPort) && (typeof (args.tcpPort) === "string")) {
		tcpPort = parseInt(args.tcpPort);
		logger.info("TCP Port loaded from arguments.");
		if (isNaN(tcpPort) || tcpPort < 1024 || tcpPort > 65535) {
			tcpPort = 14400;
			logger.warn("Unable to pass TCP Port, using default 14400 instead.");
		}
	} else if (nodeConfig.get("tcpPort") && typeof nodeConfig.get("tcpPort") === "number") {
		tcpPort = nodeConfig.get("tcpPort");
		logger.info("TCP Port loaded from configuration file." + tcpPort);
		if (isNaN(tcpPort) || tcpPort < 1024 || tcpPort > 65535) {
			tcpPort = 14400;
			logger.warn("Unable to pass TCP Port, using default 14400 instead.");
		}
	} else {
		logger.warn("TCP Port not configured. Using default instead");
		tcpPort = 14000;
	}
	// const options = {
	//     key: readFileSync(normalize(`${__dirname}/../.certs/key.pem`)),
	//     cert: readFileSync(normalize(`${__dirname}/../.certs/server.crt`))
	// }
	function httpCB(req: IncomingMessage, res: ServerResponse) {
		// Callback for receiving an HTTP request
		// Default behaviour is to return error code 404
		// console.log(`${new Date()} Received request for ${req.url}`);
		res.writeHead(404);
		res.end();
	}

	const httpServer = http.createServer(httpCB);
	httpServer.listen(tcpPort, () => {
		logger.debug(`Server is listening on port ${tcpPort}`);
	});
	const wsServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer,
		{
			cors: {
				// origin: nodeConfig.get("corsOrigins"),
				origin: ["https://localhost:3000", "ws://localhost:14400"],
				// origin: "https:*",
				methods: ["GET", "POST"],
				allowedHeaders: ["roobuck-client"],
				credentials: true,
			}
		}
	);

	//Connect to MQTT
	const mqttClient = connectMQTT();
	// Comunicate between client and server
	serverEvent(wsServer, prisma, mqttClient);

	//get data from mqtt
	listenToMqtt(mqttClient, prisma, wsServer);
}

main()
