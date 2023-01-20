import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import getDayShift from "../database/LoginList/getDayShift";
import getNightShift from "../database/LoginList/getNightShift";

async function updateTagboard(prisma: PrismaClient, wsServer: Server) {
    const dayShift = await getDayShift(prisma);

    if (dayShift != null) {
        const resultOfDayShift = dayShift;
        console.log("send")
        wsServer.emit("DayShifts", resultOfDayShift);
    }
    else {
        console.log("send empty")
        wsServer.emit("DayShifts", undefined);
    }
    const nightShfit = await getNightShift(prisma);
    // console.log("night shift" + nightShfit);
    // console.log(nightShfit);
    if (nightShfit != null) {
        const resultOfNightShift = nightShfit;
        wsServer.emit("NightShifts", resultOfNightShift);
    } else {
        wsServer.emit("NightShifts", undefined);
    }


}
export default updateTagboard;