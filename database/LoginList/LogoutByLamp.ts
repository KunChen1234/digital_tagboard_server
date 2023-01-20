import { PrismaClient } from "@prisma/client"
/**
 * 
 * @param prisma 
 * @param LampSN The serial number of devices
 * Delete user information from login list in databse with device's serial number;
 */
async function Logout(prisma: PrismaClient, LampSN: string) {
    await prisma.loginInfo.deleteMany({
        where: {
            LampSN: LampSN
        }
    });
    const a = await prisma.loginInfo.findMany();
    // console.log(a);
}
export default Logout;