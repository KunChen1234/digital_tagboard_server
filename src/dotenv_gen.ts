import nodeConfig from "config";
import {normalize} from "path";
import { writeFileSync } from "fs";

writeFileSync(normalize(`${__dirname}/../.env`), `DATABASE_URL=${nodeConfig.get("dbConfig.dbUrl")}`);