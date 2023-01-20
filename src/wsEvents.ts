"use strict";
import DepartmentInfo from "./typeguards/DepartmentInfo";
import { LampInfo } from "./typeguards/LampInfo";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import AreaInfo from "./typeguards/AreaInfo";
import LoginInfo from "./typeguards/FormOfDataFromLoginTable"
import LocationInfo from "./typeguards/LocationInfo";
import { UserInfo } from "node:os";
interface ServerToClientEvents {
	noArg: () => void;

	tagID: (tagID: string) => void;
	PeopleID: (ID: string) => void;
	/**
	 * From Master Server to digital tagboard client;
	 * PersonnellInfo: Send personnel information to client;
	 * LampInfo: Send Lamp information to client;
	 * DayShifts: Send all day shifts to tagboard client;
	 * NightShifts: Send all night shifts to tagboard client;
	 * UpdateTime: (UpdateTIme: Date) => void;
	 * UpdateDepartmentInfo: Send all departments information to client;
	 * UpdateAreaInfo: Send all areas information to client;
	 * UpdateLocation: Send all location information to client;
	 * LampAlreadyLogin: If return ture, devices already been used;
	 * PeopleAlreadyLogin: If return ture, person already login;
	 */
	DayShifts: (DayShift: LoginInfo[]) => void;
	NightShifts: (NightShift: LoginInfo[]) => void;
	UpdateTime: (UpdateTIme: Date) => void;
	UpdateDepartmentInfo: (DepartmentInfo: DepartmentInfo[]) => void;
	UpdateAreaInfo: (AreaInfo: AreaInfo[]) => void;
	UpdateLocation: (LocationInfo: LocationInfo[]) => void;
	LampAlreadyLogin: (isScanned: boolean) => void;
	PeopleAlreadyLogin: (isScanned: boolean) => void;

	/**
	 * From Master Server to Kiosk backend
	 */
	SendUserInfoToKiosk: (User: PeopleInfoTag) => void;
	ResultOfDeviceFromLoginTable: (result: boolean) => void;//if false, already login, if true, did not login
}
interface ClientToServerEvents {
	hello: () => void;
	connection_error: (err: unknown) => void;
	startNfcScan: () => void;
	beginTest: () => void;
	endTest: () => void;

	// Digital tagboard
	//Department event
	getDepartmentInfo: () => void;
	addNewDepartment: (department: DepartmentInfo) => void;
	removeDepartment: (departmentName: string) => void;
	editDepartment: (department: DepartmentInfo) => void;

	//Area event
	getAllArea: () => void;
	addNewArea: (AreaInfo: AreaInfo) => void;
	editArea: (AreaInfo: AreaInfo) => void;
	removeArea: (AreaName: string) => void;

	userInputs: (userInputs: unknown) => void;

	//Location and BSSID event
	getAllLocation: () => void;
	addNewLocation: (LocationInfo: LocationInfo) => void;
	editLocation: (LocationInfo: LocationInfo) => void;
	removeLocation: (locationName: string) => void;

	//Tagboard Information
	getLoginInfo: () => void;
	getDayShift: () => void;
	getNightShift: () => void;


	// Command from Kiosk Server
	newUserLogin: (LampSN: string) => void;
	getUserInfoFromDatabase: (ID: string) => void;
	checkDeviceInfoFromDatabase: (Device: { SN: string, MAC: string }) => void;
	Logout: () => void;
}
interface InterServerEvents {
	ping: () => void;
	test: (test: string) => void;
}
interface SocketData {
	id: string;
	timeOfConnection: Date;
}

export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData }