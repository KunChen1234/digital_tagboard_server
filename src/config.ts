// import nodeConfig from "config";
import { writeFileSync, existsSync } from "fs";
import { normalize } from "path";
import shortUUID from "short-uuid";

/**
 * Sets configs to be used in the application.
 * @returns void
 */
function setConfigs() {
	const translator = shortUUID();
	const confDir = normalize(`${__dirname}/../config`);
	// const envPath = normalize(`${__dirname}/../.env`);
	console.log(confDir);
	// let id: string;
	if (!existsSync(`${confDir}/local.json`)) {
		const id = translator.uuid();
		const data = {
			"id": id,
			"shortId": translator.fromUUID(id)
		};
		writeFileSync(`${confDir}/local.json`, JSON.stringify(data, null, 4));
	} //else {
	// id = nodeConfig.get("id");
	//}

	// const shortId = translator.fromUUID(id);
	// if (existsSync(envPath)) {
	// 	unlinkSync(envPath);
	// }

	// writeFileSync(envPath, `NODE_ENV=${process.env.NODE_ENV}\nDATABASE_URL=${nodeConfig.get("dbConfig.dbUrl")}`);
	// process.env["DATABASE_URL"] = nodeConfig.get("dbConfig.dbUrl");
	return;
}

export default setConfigs;