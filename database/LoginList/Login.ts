import { PrismaClient } from "@prisma/client";
import { TagBoardInfo } from "../../src/typeguards/TagBoardInfo";
/**
 * add new user in Login list table in databse;
 * @param tag new login user's information
 * @param prisma 
 */
async function Login(tag: TagBoardInfo, prisma: PrismaClient) {
    if (tag.person.ID && tag.lamp.MAC && tag.lamp.SN && tag.person.date && tag.person.isDayShift != null) {
        // console.log("start to save")
        await prisma.loginInfo.create(
            {
                data: {
                    userID: tag.person.ID,
                    LoginTime: tag.person.date,
                    LampMAC: tag.lamp.MAC,
                    LampSN: tag.lamp.SN,
                    LampBssid: tag.lamp.Bssid,
                    LastUpdateTime: tag.lamp.updateTime,
                    isDayShift: tag.person.isDayShift
                }
            }
        )
        const a = await prisma.loginInfo.findMany();
    }
}
export default Login;

// LampMAC        String
// LampSN         String
// LampBssid      String
// LastUpdateTime String