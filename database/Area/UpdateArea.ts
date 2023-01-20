import { PrismaClient } from '@prisma/client'
import AreaInfo from '../../src/typeguards/AreaInfo';

/**
 * 
 * @param newArea the information of area which will be updated, it cannot change area name;
 * @param prisma  prisma client;
 * @returns  all area information after update;
 */
async function UpdateAreaInfo(newArea: AreaInfo, prisma: PrismaClient): Promise<AreaInfo[]> {
    if (newArea.areaName) {
        await prisma.area.update({
            where: {
                areaName: newArea.areaName,
            },
            data: { areaColor: newArea.areaColor }
        })
    }
    const allArea: AreaInfo[] = await prisma.area.findMany({
        orderBy: {
            areaName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allArea);
    })
}
// CreateData()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })

export default UpdateAreaInfo;