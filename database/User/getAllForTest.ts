import { Area, Department, PrismaClient, User } from '@prisma/client';
import { resolve } from 'path';
import { resultOfUser } from '../../src/typeguards/FormOfDataFromUserDatabase';
const prisma = new PrismaClient();
async function SearchingByID() {

    try {
        const all = await prisma.user.findMany()
        console.log(all)
    }
    catch (e) {
        // console.log("can not find data");
        // console.log(e);
    }
    return null;
}
SearchingByID()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })