import { PrismaClient } from '@prisma/client'
import LocationInfo from '../../src/typeguards/LocationInfo';

/**
 * 
 * @param prisma prisma client
 * @returns All location information from database
 */
async function getAllLocation(prisma: PrismaClient): Promise<LocationInfo[] | undefined> {
    try {
        const allLocation: LocationInfo[] = await prisma.location.findMany(
            {
                orderBy: {
                    locationName: "asc"
                }
            }
        )
        // console.log(allLocation);
        return new Promise((resolve) => {
            resolve(allLocation);
        })
    }
    catch (e) {
        // console.log("can not find data from Location table");
        // console.log(e);
    }
}
export default getAllLocation;