import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function CreateData() {
    await prisma.user.create({
        data: {
            userID: '0000001',
            firstName: 'testFirstName_1',
            lastName: 'testLastName_1',
            areaName: "Section1",
            departmentName: "Contractor",
            job: "job1",
            photo: "miner1.jpg"
        },
    })
    const a = await prisma.user.findMany({
    })
    // console.log(a);
}
CreateData()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

//export default CreateData