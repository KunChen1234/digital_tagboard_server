import { PrismaClient } from "@prisma/client";
import setLogger from "./logger";

async function connectDb(prisma: PrismaClient): Promise<void> {
    const logger = setLogger("Connect Database");
    console.log("ConnectDataBase");
    //Connect to the database
    await prisma.$connect().then(() => {
        logger.debug("Connected To the Database");
    }).catch((err: Error) => {
        logger.error(err.message);
        logger.info("Unable to connect to database. Disconnecting");
        console.log(err.message);
        console.log("Unable to connect to database")
        process.exit(1);
    });
    return;
}
export default connectDb;