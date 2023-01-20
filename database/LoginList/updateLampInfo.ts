import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";
/**
 * 
 * @param prisma 
 * @param userID The ID of user whose information will be updated;
 * @param updateTime When the information wil be updated;
 * @param bssid The bssid of location;
 */
async function updatFromMqtt(prisma: PrismaClient, lampSN: string, updateTime: string, bssid: string) {
    await prisma.loginInfo.updateMany({
        where: {
            LampSN: lampSN,
        },
        data: { LampBssid: bssid, LastUpdateTime: updateTime }
    })
    // const a = await prisma.loginInfo.findMany();
    // console.log(a);
}
export default updatFromMqtt;