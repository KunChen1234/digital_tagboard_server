import { PrismaClient } from '@prisma/client'
import LocationInfo from '../../src/typeguards/LocationInfo';
/**
 * 
 * @param NewLocation new location information including BSSID and location name which will be saved in location table;
 * @param prisma prisma client
 * @returns all location information save in database;
 */
async function addNewLocation(NewLocation: LocationInfo, prisma: PrismaClient): Promise<LocationInfo[]> {
    await prisma.location.create({
        data: {
            locationName: NewLocation.locationName,
            BSSID: NewLocation.BSSID
        },
    })
    const allLocation: LocationInfo[] = await prisma.location.findMany({
        orderBy: {
            locationName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allLocation);
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

export default addNewLocation;