import { PrismaClient } from '@prisma/client'
import LocationInfo from '../../src/typeguards/LocationInfo';
/**
 * Used for deleting location;
 * @param BSSID The BSSID of location
 * @param prisma prisma client
 * @returns all location information from location table in database after deleted
 */
async function DeleteOneLocation(BSSID: string, prisma: PrismaClient): Promise<LocationInfo[] | undefined> {
    await prisma.location.delete({
        where: {
            BSSID: BSSID
        }
    })
    const allLocation: LocationInfo[] = await prisma.location.findMany(
        {
            orderBy: {
                locationName: "asc"
            }
        }
    );
    // console.log(allLocation);
    return new Promise((resolve) => {
        resolve(allLocation);
    })
}
export default DeleteOneLocation;