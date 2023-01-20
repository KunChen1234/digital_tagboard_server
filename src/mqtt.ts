"use strict";
import { connect, IClientOptions, MqttClient } from "mqtt";
import nodeConfig from "config";
// import setLogger from "./logger";
import { isStatusMessage } from "./typeguards/isStatusMessage";
import { EventEmitter } from 'node:events';
import setLogger from "./logger";
import exp from "node:constants";
import { PrismaClient } from "@prisma/client";
import updatFromMqtt from "../database/LoginList/updateLampInfo";
import Logout from "../database/LoginList/Logout";
import updateTagboard from "./updateTagBoard";
import { Server } from "socket.io";


/**
 * 
 * @param sn string - Serial number of test unit
 * @returns {[chargingFormat,bssid]} Object containing booleans or nulls for test results and an object containing device props
 */
const logger = setLogger();
function connectMQTT() {
    const mqttOptions: IClientOptions = {
        clientId: `roobuck_test_Kiosk`,
        username: nodeConfig.get("mqttUser"),
        password: nodeConfig.get("mqttPass")
    }
    const mqttBroker = "mqtt://192.168.1.105";
    logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
    const mqttClient = connect(mqttBroker, mqttOptions);
    return mqttClient;
}

function addNewSNIntoMQTT(mqttClient: MqttClient, SN: string) {
    mqttClient.subscribe(
        `${SN}/device/status`
    );
}
function removeFromMQTT(mqttClient: MqttClient, SN: string) {
    mqttClient.unsubscribe(`${SN}/device/status`);
}
function listenToMqtt(mqttClient: MqttClient, prisma: PrismaClient, wsServer: Server) {
    mqttClient.on("message", async (topic, payload) => {
        logger.debug("payload: " + payload.toString());

        // console.log("topic: " + topic.toString());
        if (topic.split(/\/(.*)/s)[1] === "device/status") {
            const SN = topic.split(/\/(.*)/s)[0];
            const date = new Date();
            const updateTime = Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
            try {
                const msg = JSON.parse(payload.toString());
                if (isStatusMessage(msg)) {
                    if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
                        // Do Something
                        // Confirm Fuel Gauge is operating
                        // console.log("FUEL VALUE START");
                        console.log(msg.fuelRaw.toString());
                        // console.log("FUEL VALUE END");
                        if (msg.charging == 0) {
                            updatFromMqtt(prisma, SN, updateTime, msg.bssid);
                        }
                        else {
                            mqttClient.unsubscribe(
                                `${SN}/device/status`
                            );
                            await Logout(prisma, SN);
                            updateTagboard(prisma, wsServer);
                        }
                    } else {
                        logger.debug("FUEL VALUE START");
                        logger.debug(msg.fuelRaw.toString());
                        logger.debug("FUEL VALUE END");
                    }
                } else {
                    logger.debug("Can not get data from mqtt!");
                    // Fail Condition
                }
            } catch (err) {
                if (err instanceof Error) {
                    // console.log("Error:" + err);
                }
            }
        }
    });
}
export { connectMQTT, listenToMqtt, addNewSNIntoMQTT, removeFromMQTT }




// async function mqtt(sn: string): Promise<
//     {
//         bssid: string | null;
//         chargingStatus: boolean | undefined
//     }> {
//     return new Promise((resolve) => {
//         // const logger = setLogger("mqtt.js");
//         let result: {
//             bssid: string | null;
//             chargingStatus: boolean | undefined
//         } = {
//             bssid: null,
//             chargingStatus: undefined
//         }
//         const mqttOptions: IClientOptions = {
//             clientId: `roobuck_test_Kiosk`,
//             username: nodeConfig.get("mqttUser"),
//             password: nodeConfig.get("mqttPass")
//         }
//         // console.log(mqttOptions);
//         const logger = setLogger();
//         const mqttBroker = "mqtt://192.168.1.105";
//         // console.log(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
//         logger.debug(`Attempting MQTT Connection to broker ${mqttBroker} with username ${mqttOptions.username}`)
//         const mqttClient = connect(mqttBroker, mqttOptions);
//         mqttClient.on("connect", (connack) => {
//             // console.log("connected: " + JSON.stringify(connack))
//             // logger.debug("Connected");
//             // console.log("connected")
//             mqttClient.subscribe([
//                 `${sn}/device/status`,
//                 `production/testing/${sn}`
//             ]);
//             mqttClient.publish(`production/testing/${sn}`, sn)
//         });

//         // const endTest = setTimeout(() => {
//         //     // logger.error("Timeout Reached. Test Incomplete")
//         //     console.log("Timeout Reached. Test Incomplete");
//         //     testManage.emit("endTest");
//         // }, 20 * 1000);
//         const testManage = new EventEmitter();
//         testManage.on("endTest", () => {
//             // clearTimeout(endTest);
//             testManage.removeAllListeners("endTest");
//             mqttClient.end();
//             // logger.debug("Closing MQTT Connection");
//             // logger.debug(JSON.stringify(results));
//             resolve(result);
//         });
//         let statusReceived = false;
//         let fuelOk = false;
//         mqttClient.on("message", (topic, payload) => {
//             if (topic === `production/testing/${sn}`) {
//                 // logger.debug(payload.toString());
//                 // console.log("tpic produnction: " + payload.toString())
//             }
//             // logger.debug(payload.toString());
//             // console.log(payload.toString());
//             if (topic.split(/\/(.*)/s)[1] === "device/status") {
//                 statusReceived = true;
//                 try {
//                     const msg = JSON.parse(payload.toString());
//                     if (isStatusMessage(msg)) {
//                         if (msg.fuelRaw > 0 && msg.fuelRaw < 5000) {
//                             // Do Something
//                             // Confirm Fuel Gauge is operating
//                             // console.log("FUEL VALUE START");
//                             // console.log(msg.fuelRaw.toString());
//                             // console.log("FUEL VALUE END");
//                             fuelOk = true
//                             result.bssid = msg.bssid;
//                             if (msg.charging === 1) {
//                                 result.chargingStatus = true;
//                             } else if (msg.charging === 0) {
//                                 result.chargingStatus = false;
//                             }
//                             // console.log("DataFrom" + payload.toString());
//                         } else {
//                             // console.log("FUEL VALUE START");
//                             // console.log(msg.fuelRaw.toString());
//                             // console.log("FUEL VALUE END");
//                             // fuelOk = false;
//                         }
//                     } else {
//                         // console.log("failed");
//                         // Fail Condition
//                     }
//                 } catch (err) {
//                     if (err instanceof Error) {
//                         // console.log("Error:" + err);
//                     }
//                 }
//                 testManage.emit("endTest")
//             }
//             if (statusReceived) {
//                 testManage.emit("endTest")
//             }
//         });
//     })
// }

// // async function a() {
// //     const a = await mqtt("cr4c7525bc785c");
// //     console.log("bssid:" + a.bssid);
// //     console.log("ChargingStatus:" + a.chargingStatus);
// // }
// // a()
// export default mqtt;