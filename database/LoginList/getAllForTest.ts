import { Area, Department, Location, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";
const prisma = new PrismaClient();
async function getAllLoginInfoForTest() {

    let data: (LoginInfo & {
        User: (User & {
            Area: Area | null;
            Department: Department | null;
        }) | null;
    })[]
    data = await prisma.loginInfo.findMany({
        include: {
            User:
            {
                include: {
                    Area: true,
                    Department: true
                }
            }
        }
    });
    console.log(data);
}
getAllLoginInfoForTest().then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })