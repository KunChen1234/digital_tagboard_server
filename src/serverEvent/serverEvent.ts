import { PrismaClient } from "@prisma/client";
import { MqttClient } from "mqtt";
import { Server, Socket } from "socket.io";
import { cli } from "winston/lib/winston/config";
import AddArea from "../../database/Area/AddNewArea";
import deleteOneArea from "../../database/Area/DeleteArea";
import getAllArea from "../../database/Area/GetAllArea";
import UpdateAreaInfo from "../../database/Area/UpdateArea";
import closeDatabase from "../../database/closeDatabase";
import AddNewDepartment from "../../database/Department/AddDepartment";
import DeleteOneDepartment from "../../database/Department/DeleteDepartment";
import getAllDepartment from "../../database/Department/SearchDepartment";
import UpdateDepartmentInfo from "../../database/Department/UpdateDepartment";
import addNewLocation from "../../database/Location/AddLocation";
import DeleteOneLocation from "../../database/Location/DeleteLocation";
import getAllLocation from "../../database/Location/SearchLocation";
import UpdateLocation from "../../database/Location/UpdateLocation";
import checkLamp from "../../database/LoginList/checkLamp";
// import getAllLoginInfo from "../../database/LoginList/getAllLoginInfo";
import getDayShift from "../../database/LoginList/getDayShift";
import getNightShift from "../../database/LoginList/getNightShift";
import SearchingByID from "../../database/User/search";
import setLogger from "../logger";
import { addNewSNIntoMQTT, removeFromMQTT } from "../mqtt";
import LoginInfo from "../typeguards/FormOfDataFromLoginTable";
import updateTagboard from "../updateTagBoard";
function serverEvent(wsServer: Server, prisma: PrismaClient, mqttClient: MqttClient) {
	const logger = setLogger("wsEvent");
	wsServer.on("connect", (client) => {
		logger.debug("client connected");
		client.on("addNewArea", async (msg) => {
			// console.log(msg);
			const allAreaInfo = await AddArea(msg, prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateAreaInfo", allAreaInfo);
		})
		client.on("addNewDepartment", async (msg) => {
			// console.log(msg);
			const allDepartmnet = await AddNewDepartment(msg, prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
		})
		client.on("getDepartmentInfo", async () => {
			// console.log("client need get depart")
			const allDepartmnet = await getAllDepartment(prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})
		client.on("removeDepartment", async (msg) => {
			// console.log("remove" + msg);
			const allDepartmnet = await DeleteOneDepartment(msg, prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})

		client.on("getAllArea", async () => {
			const allAreaInfo = await getAllArea(prisma);
			closeDatabase(prisma);
			if (allAreaInfo) {
				wsServer.emit("UpdateAreaInfo", allAreaInfo);
			}
		})

		client.on("editDepartment", async (msg) => {
			const allDepartmnet = await UpdateDepartmentInfo(msg, prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})

		client.on("editArea", async (msg) => {
			const allArea = await UpdateAreaInfo(msg, prisma);
			closeDatabase(prisma);
			if (allArea) {
				wsServer.emit("UpdateAreaInfo", allArea);
			}
		})

		client.on("removeArea", async (msg) => {
			const allArea = await deleteOneArea(msg, prisma);
			closeDatabase(prisma);
			if (allArea) {
				wsServer.emit("UpdateAreaInfo", allArea);
			}
		})

		client.on("getDayShift", async () => {
			// console.log("client need day shift");
			const dayShift = await getDayShift(prisma);
			closeDatabase(prisma);
			if (dayShift != null) {
				// console.log("send to day shift page")
				const resultOfDayShift = dayShift;
				// console.log(resultOfDayShift);
				wsServer.emit("DayShifts", resultOfDayShift);
			}
		})
		client.on("getNightShift", async () => {
			const nightShfit = await getNightShift(prisma);
			closeDatabase(prisma);
			if (nightShfit != null) {
				const resultOfNightShift = nightShfit;
				wsServer.emit("NightShifts", resultOfNightShift);
			}
		})

		client.on("getAllLocation", async () => {
			const allLocation = await getAllLocation(prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateLocation", allLocation);
		})

		client.on("addNewLocation", async (msg) => {
			// console.log(msg);
			const allLocation = await addNewLocation(msg, prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateLocation", allLocation);
		})
		client.on("editLocation", async (msg) => {
			const allLocation = await UpdateLocation(msg, prisma);
			closeDatabase(prisma);
			if (allLocation) {
				wsServer.emit("UpdateLocation", allLocation);
			}
		})

		client.on("removeLocation", async (msg) => {
			const allLocation = await DeleteOneLocation(msg, prisma);
			closeDatabase(prisma);
			if (allLocation) {
				wsServer.emit("UpdateLocation", allLocation);
			}
		})

		/**
		 * Communication with Kiosk Server
		 */
		client.on("newUserLogin", async (msg) => {
			updateTagboard(prisma, wsServer);
			addNewSNIntoMQTT(mqttClient, msg);
		});
		client.on("Logout", async () => {
			logger.debug("logout");
			// removeFromMQTT()
			updateTagboard(prisma, wsServer);
		})
	})
}
export default serverEvent;