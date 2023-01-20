import { PrismaClient } from "@prisma/client"
/**
 * 
 * @param prisma 
 * @param userID The ID of user which will be deleted from Login list table in database;
 */
async function Logout(prisma: PrismaClient, LampSN: string) {
    await prisma.loginInfo.deleteMany({
        where: {
            LampSN: LampSN
        }
    });
    // const a = await prisma.loginInfo.findMany();
    // console.log(a);
}
export default Logout;