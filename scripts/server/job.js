// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initJobScript() {
	logToConsole(LOG_INFO, "[VRR.Job]: Initializing job script ...");
	getServerData().jobs = loadJobsFromDatabase();

	createAllJobPickups();
	createAllJobBlips();

	setAllJobIndexes();

	logToConsole(LOG_INFO, "[VRR.Job]: Job script initialized successfully!");
	return true;
}

// ===========================================================================

function loadJobsFromDatabase() {
	logToConsole(LOG_DEBUG, "[VRR.Job]: Loading jobs from database ...");

	let tempJobs = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM job_main WHERE job_enabled = 1 AND job_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobData = new JobData(dbAssoc);
					tempJobData.locations = loadJobLocationsFromDatabase(tempJobData.databaseId);
					tempJobData.equipment = loadJobEquipmentsFromDatabase(tempJobData.databaseId);
					tempJobData.uniforms = loadJobUniformsFromDatabase(tempJobData.databaseId);
					tempJobData.routes = loadJobRoutesFromDatabase(tempJobData.databaseId);
					tempJobs.push(tempJobData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job '${tempJobData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobs.length} jobs loaded from database successfully!`);
	return tempJobs;
}

// ===========================================================================

function loadAllJobEquipmentFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].equipment = loadJobEquipmentsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobUniformsFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].uniforms = loadJobUniformsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobRoutesFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].routes = loadJobRoutesFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobLocationsFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].locations = loadJobLocationsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadJobRoutesFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job routes for job ${jobDatabaseId} from database ...`);

	let tempJobRoutes = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_route` WHERE `job_route_enabled` = 1 AND `job_route_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobRouteData = new JobEquipmentData(dbAssoc);
					tempJobRouteData.locations = loadJobRouteLocationsFromDatabase(tempJobRouteData.databaseId);
					tempJobRoutes.push(tempJobRouteData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment '${tempJobRouteData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobRoutes.length} job routes for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobRoutes;
}

// ===========================================================================

function loadJobRouteLocationsFromDatabase(jobRouteId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading locations for job route ${jobRouteId} from database ...`);

	let tempJobRouteLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_route_loc` WHERE `job_route_loc_enabled` = 1 AND `job_route_loc_route` = " + toString(jobRouteId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobRouteLocationData = new JobRouteLocationData(dbAssoc);
					tempJobRouteLocations.push(tempJobRouteLocationData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job route location '${tempJobRouteLocationData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobRouteLocations.length} locations for job route ${jobRouteId} loaded from database successfully!`);
	return tempJobEquipmentItems;
}

// ===========================================================================

function loadJobEquipmentsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job equipments for job ${jobDatabaseId} from database ...`);

	let tempJobEquipments = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_equip` WHERE `job_equip_enabled` = 1 AND `job_equip_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobEquipmentData = new JobEquipmentData(dbAssoc);
					tempJobEquipmentData.items = loadJobEquipmentItemsFromDatabase(tempJobEquipmentData.databaseId);
					tempJobEquipments.push(tempJobEquipmentData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment '${tempJobEquipmentData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobEquipments.length} job equipments for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobEquipments;
}

// ===========================================================================

function loadJobLocationsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job locations for job ${jobDatabaseId} from database ...`);

	let tempJobLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_loc` WHERE `job_loc_enabled` = 1 AND `job_loc_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobLocationData = new JobLocationData(dbAssoc);
					tempJobLocations.push(tempJobLocationData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job location '${tempJobLocationData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobLocations.length} job locations for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobLocations;
}

// ===========================================================================

function loadJobUniformsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job uniforms for job ${jobDatabaseId} from database ...`);

	let tempJobUniforms = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_uniform` WHERE `job_uniform_enabled` = 1 AND `job_uniform_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobUniformData = new JobUniformData(dbAssoc);
					tempJobUniforms.push(tempJobUniformData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job uniform '${tempJobUniformData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobUniforms.length} job uniforms for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobUniforms;
}

// ===========================================================================

function loadJobEquipmentItemsFromDatabase(jobEquipmentDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job equipment items for job equipment ${jobEquipmentDatabaseId} from database ...`);

	let tempJobEquipmentItems = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_equip_item` WHERE `job_equip_item_enabled` = 1 AND `job_equip_item_equip` = " + toString(jobEquipmentDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobEquipmentItemData = new JobEquipmentItemData(dbAssoc);
					tempJobEquipmentItems.push(tempJobEquipmentItemData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment item '${tempJobEquipmentItemData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobEquipmentItems.length} job equipment items for equipment ${jobEquipmentDatabaseId} loaded from database successfully!`);
	return tempJobEquipmentItems;
}

// ===========================================================================

function createAllJobBlips() {
	if(!getServerConfig().createJobBlips) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job] Spawning all job location blips ...`);
	for(let i in getServerData().jobs) {
		for(let j in getServerData().jobs[i].locations) {
			getServerData().jobs[i].locations[j].blip = game.createBlip((getServerData().jobs[i].blipModel!=0) ? getServerData().jobs[i].blipModel : 0, getServerData().jobs[i].locations[j].position, 2, getColourByName("yellow"));
			setElementStreamInDistance(getServerData().jobs[i].locations[j].blip, getGlobalConfig().jobBlipStreamInDistance);
			setElementStreamOutDistance(getServerData().jobs[i].locations[j].blip, getGlobalConfig().jobBlipStreamOutDistance);
			addToWorld(getServerData().jobs[i].locations[j].blip);
			logToConsole(LOG_DEBUG, `[VRR.Job] Job '${getServerData().jobs[i].name}' location blip ${j} spawned!`);
		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Job] All job location blips spawned!`);
}

// ===========================================================================

function createAllJobPickups() {
	if(!getServerConfig().createJobPickups) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job] Spawning all job location pickups ...`);
	let pickupCount = 0;
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].pickupModel != 0) {
			for(let j in getServerData().jobs[i].locations) {
				pickupCount++;
				getServerData().jobs[i].locations[j].pickup = game.createPickup(getServerData().jobs[i].pickupModel, getServerData().jobs[i].locations[j].position);
				getServerData().jobs[i].locations[j].pickup.onAllDimensions = false;
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.owner.type", VRR_PICKUP_JOB, false);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.owner.id", j, false);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.type", VRR_LABEL_JOB, true);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.name", getServerData().jobs[i].name, true);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.jobType", getServerData().jobs[i].databaseId, true);
				getServerData().jobs[i].locations[j].pickup.dimension = getServerData().jobs[i].locations[j].dimension;
				addToWorld(getServerData().jobs[i].locations[j].pickup);

				logToConsole(LOG_DEBUG, `[VRR.Job] Job '${getServerData().jobs[i].name}' location pickup ${j} spawned!`);
			}
		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Job] All job location pickups (${pickupCount}) spawned!`);
}

// ===========================================================================

function showJobInformationToPlayer(client, jobType) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	if(jobType == getPlayerCurrentSubAccount(client).job) {
		messagePlayerInfo("Welcome back to your job. Use /startwork to begin.");
		return false;
	}

	switch(jobType) {
		case VRR_JOB_POLICE:
			if(!canPlayerUsePoliceJob(client)) {
				return false;
			}

			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Police Officers are enforcers of the law.");
			messagePlayerInfo(client, "- Use /startwork at a police station to work as a Police Officer.");
			messagePlayerInfo(client, "- Use /laws to see a list of laws.");
			messagePlayerInfo(client, "- Commands are: /cuff, /drag, /detain, /arrest, /search /tazer /radio");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Paramedics help people by healing them.");
			messagePlayerInfo(client, "- Use /startwork at the hospital to work as a Paramedic.");
			messagePlayerInfo(client, "- People can enter your ambulance to get healed.");
			messagePlayerInfo(client,  "- The pay depends on the player's health before healing them.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_FIRE:
			if(!canClientUseFireJob(client)) {
				return false;
			}
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Firefighters put out vehicle and building fires.");
			messagePlayerInfo(client, "- Use /startwork at the fire station to work as a Firefighter.");
			messagePlayerInfo(client, "- Get in a firetruck and you will be told where to go.");
			messagePlayerInfo(client, "- Use the firetruck hose to put out fires");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Bus Drivers transport people around the city on a route");
			messagePlayerInfo(client, "- Use /startwork at the bus depot to work as a Bus Driver.");
			messagePlayerInfo(client, "- Passengers can get on/off at any stop on your route");
			messagePlayerInfo(client, "- Stay on your assigned route. You will be paid when finished.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Taxi Drivers transport people around the city");
			messagePlayerInfo(client, "- Use /startwork at the taxi depot to work as a Taxi Driver.");
			messagePlayerInfo(client, "- Use /fare to set a fare. Fares start when a player gets in.");
			messagePlayerInfo(client, "- The meter will run until the player exits the vehicle.");
			messagePlayerInfo(client, "- You will automatically receive the fare money");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Garbage Collectors pick up the trash around the city.");
			messagePlayerInfo(client, "- Use /startwork at the garbage depot to work as a Garbage Collector.");
			messagePlayerInfo(client, "- Drive up to a garbage can or dumpster, and right click to grab a bag.");
			messagePlayerInfo(client, "- Walk up to the back of your truck and right click again to throw the bag in.");
			messagePlayerInfo(client, "- Your truck can hold 25 trashbags. Each bag is worth $25");
			messagePlayerInfo(client, "- Drive to the garbage depot again to deliver trash");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		default:
			break;
	}
}

// ===========================================================================

function takeJobCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use any jobs!");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));
	let jobData = getJobData(closestJobLocation.jobIndex);

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().takeJobDistance) {
		messagePlayerError(client, "There are no job points close enough!");
		return false;
	}

	if(getPlayerCurrentSubAccount(client).job > VRR_JOB_NONE) {
		messagePlayerError(client, `{MAINCOLOUR}You already have a job! Use {ALTCOLOUR}/quitjob {MAINCOLOUR}to quit your current job.`);
		return false;
	}

	if(!canPlayerUseJob(client, closestJobLocation.jobIndex)) {
		messagePlayerError(client, "You can't use this job!");
		return false;
	}

	takeJob(client, closestJobLocation.jobIndex);
	messagePlayerSuccess(client, `{MAINCOLOUR}You now have the {jobYellow}${jobData.name} {MAINCOLOUR}job`);
	return true;
}

// ===========================================================================

function startWorkingCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) < getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType == VRR_VEHOWNER_JOB) {
			messagePlayerError(client, "This is not a job vehicle!");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, "This is not your job vehicle!");
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, "You don't have a job!");
			messagePlayerInfo(client, "You can get a job by going the yellow points on the map.");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.job) {
			messagePlayerError(client, "This is not your job!");
			messagePlayerInfo(client, `If you want this job, use {ALTCOLOUR}/quitjob {MAINCOLOUR}to quit your current job.`);
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	messagePlayerSuccess(client, `You are now working for the {jobYellow}${jobData.name} {MAINCOLOUR}job`);
	startWorking(client);
	//messagePlayerNewbieTip(client, `Enter a job vehicle to get started!`);
	return true;
}

// ===========================================================================

function stopWorkingCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working!");
		return false;
	}

	deleteJobItems(client);
	stopWorking(client);
	messagePlayerSuccess(client, "You have stopped working!");
	return true;
}

// ===========================================================================

function startWorking(client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	switchPlayerActiveHotBarSlot(client, -1);
	getPlayerCurrentSubAccount(client).skin = getPlayerSkin(client);
	storePlayerItemsInJobLocker(client);
	messagePlayerInfo(client, "Your personal items have been stored in your locker while you work");

	getPlayerCurrentSubAccount(client).isWorking = true;

	let jobId = getPlayerCurrentSubAccount(client).job;
	switch(getJobIndexFromDatabaseId(jobId)) {
		case VRR_JOB_POLICE:
			messagePlayerInfo(client, "Use {ALTCOLOUR}/uniform {MAINCOLOUR}and {ALTCOLOUR}/equip {MAINCOLOUR}to get your equipment.");
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, "Use {ALTCOLOUR}/uniform {MAINCOLOUR}and {ALTCOLOUR}/equip {MAINCOLOUR}to get your equipment.");
			break;

		case VRR_JOB_FIRE:
			messagePlayerInfo(client, "Use {ALTCOLOUR}/uniform {MAINCOLOUR}and {ALTCOLOUR}/equip {MAINCOLOUR}to get your equipment.");
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, "Get in a bus to get started.");
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, "Get in a taxi to get started.");
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, "Get in a trash truck to get started.");
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		default:
			break;
	}

	updatePlayerNameTag(client);
	sendPlayerWorkingState(client, true);
	//showStartedWorkingTip(client);
}

// ===========================================================================

function getJobInfoCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));

	messagePlayerInfo(client, `{jobYellow}[Job Info] {MAINCOLOUR}Name: {ALTCOLOUR}${getJobData(closestJobLocation.job).name}, {MAINCOLOUR}Enabled: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.job).enabled))}, {MAINCOLOUR}Whitelisted: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.job).whiteListEnabled))}, {MAINCOLOUR}Blacklisted: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.job).blackListEnabled))}, {MAINCOLOUR}ID: {ALTCOLOUR}${getJobData(closestJobLocation.job).id}/${closestJobLocation.job}`);
}

// ===========================================================================

function getJobLocationInfoCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));

	messagePlayerInfo(client, `{jobYellow}[Job Location Info] {MAINCOLOUR}Job: {ALTCOLOUR}${getJobData(closestJobLocation.job).name} (${getJobData(closestJobLocation.job).id}/${closestJobLocation.job}), {MAINCOLOUR}Enabled: {ALTCOLOUR}${getYesNoFromBool(closestJobLocation.enabled)}, {MAINCOLOUR}Database ID: {ALTCOLOUR}${closestJobLocation.databaseId}`);
}

// ===========================================================================

function givePlayerJobEquipment(client, equipmentId) {
	if(!canPlayerUseJobs(client)) {
		return false;
	}

	let jobId = getPlayerJob(client);

	for(let i in getJobData(jobId).equipment[equipmentId].items) {
		let value = getJobData(jobId).equipment[equipmentId].items[i].value
		if(getItemTypeData(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType)).useType == VRR_ITEM_USETYPE_WALKIETALKIE) {
			value = getJobData(jobId).walkieTalkieFrequency;
		}
		let itemId = createItem(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType), value, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
		getItemData(itemId).needsSaved = false;
		getItemData(itemId).databaseId = -1; // Make sure it doesnt save
		let freeSlot = getPlayerFirstEmptyHotBarSlot(client);
		getPlayerData(client).hotBarItems[freeSlot] = itemId;
		getPlayerData(client).jobEquipmentCache.push(itemId);
		updatePlayerHotBar(client);
	}

	switchPlayerActiveHotBarSlot(client, -1);
}

// ===========================================================================

function stopWorking(client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	if(!isPlayerWorking(client)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).isWorking = false;

	setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);

	let jobVehicle = getPlayerCurrentSubAccount(client).lastJobVehicle;
	if(jobVehicle) {
		if(client.player.vehicle) {
			removePlayerFromVehicle(client);
			//client.player.removeFromVehicle();
		}

		respawnVehicle(jobVehicle);

		getPlayerCurrentSubAccount(client).lastJobVehicle = false;
	}

	setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
	deleteJobItems(client);
	restorePlayerJobLockerItems(client);
	respawnJobVehicle(client);

	let jobId = getPlayerJob(client);
	switch(getJobType(jobId)) {
		case VRR_JOB_POLICE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the police station");
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the hospital");
			break;

		case VRR_JOB_FIRE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the fire station");
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, "Your vehicle has been returned to the bus depot");
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, "Your vehicle has been returned to the taxi depot");
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, "Your vehicle has been returned to the city trash dump");
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		default:
			break;
	}

	updatePlayerNameTag(client);
	sendPlayerWorkingState(client, false);
}

// ===========================================================================

function jobUniformCommand(command, params, client) {
	if(!getPlayerJob(client)) {
		messagePlayerError(client, "You don't have a job!");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork at your job location or a job vehicle.");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) < getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType == VRR_VEHOWNER_JOB) {
			messagePlayerError(client, "This is not a job vehicle!");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, "This is not your job vehicle!");
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, "You don't have a job!");
			messagePlayerInfo(client, "You can get a job by going the yellow points on the map.");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.job) {
			messagePlayerError(client, "This is not your job!");
			messagePlayerInfo(client, `If you want this job, use /quitjob to quit your current job.`);
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	let uniforms = jobData.uniforms;

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));

		for(let i in uniforms) {
			messagePlayerNormal(client, `${toInteger(i)+1}: ${uniforms[i].name} (Requires rank ${uniforms[i].requiredRank})`);
		}
		return false;
	}

	let uniformId = toInteger(params) || 1;
	if(uniformId < 1 || uniformId > uniforms.length) {
		messagePlayerError(client, "That uniform ID is invalid!");
		return false;
	}

	setPlayerSkin(client, jobData.uniforms[uniformId-1].skin);

	//messagePlayerSuccess(client, `You have been given a {ALTCOLOUR}${uniforms[uniformId-1].name} {MAINCOLOUR}uniform and you can put it on from your inventory.`);
	meActionToNearbyPlayers(client, `puts on ${getProperDeterminerForName(jobData.uniforms[uniformId-1].name)} ${jobData.uniforms[uniformId-1].name} uniform`);
	//let itemId = createItem(getItemTypeFromParams("Outfit"), getJobData(jobId).uniforms[uniformId-1].skin, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
	//let freeSlot = getPlayerFirstEmptyHotBarSlot(client);
	//getPlayerData(client).hotBarItems[freeSlot] = itemId;
	//getPlayerData(client).jobEquipmentCache.push(itemId);
	//updatePlayerHotBar(client);
}

// ===========================================================================

function jobEquipmentCommand(command, params, client) {
	if(!getPlayerJob(client)) {
		messagePlayerError(client, "You don't have a job!");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork at your job location.");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) < getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType == VRR_VEHOWNER_JOB) {
			messagePlayerError(client, "This is not a job vehicle!");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, "This is not your job vehicle!");
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, "You don't have a job!");
			messagePlayerInfo(client, "You can get a job by going the yellow points on the map.");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.job) {
			messagePlayerError(client, "This is not your job!");
			messagePlayerInfo(client, `If you want this job, use /quitjob to quit your current job.`);
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	let equipments = jobData.equipment;

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		messagePlayerNormal(client, `0: No equipment`);
		for(let i in equipments) {
			messagePlayerNormal(client, `${toInteger(i)+1}: ${equipments[i].name} (Requires rank ${equipments[i].requiredRank})`);
		}
		return false;
	}

	let equipmentId = toInteger(params) || 1;

	if(equipmentId == 0) {
		messagePlayerSuccess(client, "You put your equipment away");
		return true;
	}

	if(equipmentId < 1 || equipmentId > equipments.length) {
		messagePlayerError(client, "That equipment ID is invalid!");
		return false;
	}

	deleteJobItems(client);
	givePlayerJobEquipment(client, equipmentId-1);
	//messagePlayerSuccess(client, `You have been given the ${equipments[equipmentId-1].name} equipment`);
	meActionToNearbyPlayers(client, `grabs the ${jobData.equipment[equipmentId-1].name} equipment from the locker`);
}

// ===========================================================================

function quitJobCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	stopWorking(client);
	quitJob(client);
	messagePlayerSuccess(client, "You are now unemployed!");
	return true;
}

// ===========================================================================

function jobRadioCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	return true;
}

// ===========================================================================

function jobDepartmentRadioCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	return true;
}

// ===========================================================================

function getJobType(jobId) {
	return getJobData(jobId).type;
}

// ===========================================================================

function doesPlayerHaveJobType(client, jobType) {
	return (getJobType(getJobIdFromDatabaseId(getPlayerCurrentSubAccount(client).job)) == jobType) ? true : false;
}

// ===========================================================================

function getJobData(jobId) {
	if(typeof getServerData().jobs[jobId] != "undefined") {
		return getServerData().jobs[jobId];
	}

	return false;
}

// ===========================================================================

function quitJob(client) {
	stopWorking(client);
	getPlayerCurrentSubAccount(client).job = 0;
	sendPlayerJobType(client, 0);
}

// ===========================================================================

function takeJob(client, jobId) {
	getPlayerCurrentSubAccount(client).job = getJobData(jobId).databaseId;
	sendPlayerJobType(client, getJobData(jobId).databaseId);
}

// ===========================================================================

function reloadAllJobsCommand(command, params, client) {
	forceAllPlayersToStopWorking();

	clearArray(getServerData().jobs);
	getServerData().jobs = loadJobsFromDatabase();

	for(let i in getServerData().jobs) {
		for(let j in getServerData().jobs[i].locations) {
			deleteJobLocationPickup(i, j);
			deleteJobLocationBlip(i, j);
			createJobLocationPickup(i, j);
			createJobLocationBlip(i, j);
		}
	}

	messageAdminAction(`All server jobs have been reloaded by an admin!`);
}

// ===========================================================================

function createJobLocationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);

	if(!getJobData(jobId)) {
		messagePlayerError(client, "That job was not found!");
		return false;
	}

	createJobLocation(jobId, getPlayerPosition(client), getPlayerInterior(client), getPlayerDimension(client));
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}created a location for the {ALTCOLOUR}${getJobData(jobId).name} {MAINCOLOUR}job`);
	return true;
}

// ===========================================================================

function deleteJobLocationCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted location {ALTCOLOUR}${closestJobLocation.databaseId} {MAINCOLOUR}for the {ALTCOLOUR}${getJobData(closestJobLocation.jobIndex).name} {MAINCOLOUR}job`);

	quickDatabaseQuery(`DELETE FROM job_loc WHERE job_loc_id = ${closestJobLocation.databaseId}`);

	let tempIndex = closestJobLocation.index;
	let tempJob = closestJobLocation.job;
	deleteJobLocation(closestJobLocation);
	getJobData(tempJob).locations.splice(tempIndex, 1);
}

// ===========================================================================

function toggleJobLocationEnabledCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));

	closestJobLocation.enabled = !closestJobLocation.enabled;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(closestJobLocation.enabled)} location {ALTCOLOUR}${closestJobLocation.databaseId} {MAINCOLOUR}for the {ALTCOLOUR}${getJobData(closestJobLocation.jobIndex).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function toggleJobEnabledCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	getJobData(jobId).enabled = !getJobData(jobId).enabled;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).enabled)} {MAINCOLOUR}the {ALTCOLOUR}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function toggleJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	getJobData(jobId).whiteListEnabled = !getJobData(jobId).whiteListEnabled;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).whiteListEnabled)} {MAINCOLOUR}the whitelist for the {ALTCOLOUR}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function toggleJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	getJobData(jobId).blackListEnabled = !getJobData(jobId).blackListEnabled;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).blackListEnabled)} {MAINCOLOUR}the blacklist for the {ALTCOLOUR}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function addPlayerToJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(splitParams[0]);
	let jobId = getJobFromParams(splitParams[1]) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, `That player was not found!`);
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, `That job was not found!`);
		return false;
	}

	if(isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already blacklisted from that job!`);
		return false;
	}

	addPlayerToJobBlackList(targetClient, jobId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}added ${getCharacterFullName(targetClient)} {MAINCOLOUR}to the blacklist for the {ALTCOLOUR}${jobData.name} {MAINCOLOUR}job`);
}

// ===========================================================================

function removePlayerFromJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(splitParams[0]);
	let jobId = getJobFromParams(splitParams[1]) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, `That player was not found!`);
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, `That job was not found!`);
		return false;
	}

	if(!isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not blacklisted from that job!`);
		return false;
	}

	removePlayerFromJobBlackList(targetClient, jobId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}removed ${getCharacterFullName(targetClient)} {MAINCOLOUR}from the blacklist for the {ALTCOLOUR}${jobData.name} {MAINCOLOUR}job`);
}

// ===========================================================================

function addPlayerToJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(splitParams[0]);
	let jobId = getJobFromParams(splitParams[1]) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, `That player was not found!`);
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, `That job was not found!`);
		return false;
	}

	if(isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already whitelisted from that job!`);
		return false;
	}

	addPlayerToJobWhiteList(targetClient, jobId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}added ${getCharacterFullName(targetClient)} {MAINCOLOUR}to the whitelist for the {ALTCOLOUR}${jobData.name} {MAINCOLOUR}job`);
}

// ===========================================================================

function removePlayerFromJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(splitParams[0]);
	let jobId = getJobFromParams(splitParams[1]) || getClosestJobLocation(getPlayerPosition(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, `That player was not found!`);
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, `That job was not found!`);
		return false;
	}

	if(!isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not whitelisted from that job!`);
		return false;
	}

	removePlayerFromJobWhiteList(targetClient, jobId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}removed ${getCharacterFullName(targetClient)} {MAINCOLOUR}from the whitelist for the {ALTCOLOUR}${jobData.name} {MAINCOLOUR}job`);
}

// ===========================================================================

function forceAllPlayersToStopWorking() {
	getClients().forEach(function(client) {
		if(!client.console) {
			stopWorking(client);
		}
	});
}

// ===========================================================================

function jobStartRouteCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You aren't working yet! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_BUS) && !doesPlayerHaveJobType(client, VRR_JOB_GARBAGE)) {
		messagePlayerError(client, "Your job doesn't use a route!");
        return false;
	}

	if(!isPlayerInJobVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle that belongs to your job!");
        return false;
	}

	startJobRoute(client);

	return true;
}

// ===========================================================================

function jobStopRouteCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You aren't working yet! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_BUS) && !doesPlayerHaveJobType(client, VRR_JOB_GARBAGE)) {
		messagePlayerError(client, "Your job doesn't use a route!");
        return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, "You aren't on a job route!");
        return false;
	}

	stopJobRoute(client);
	return true;
}

// ===========================================================================

function isPlayerInJobVehicle(client) {
	if(getPlayerVehicle(client)) {
		let vehicle = getPlayerVehicle(client);
		if(isVehicleOwnedByJob(vehicle, getPlayerCurrentSubAccount(client).job)) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isPlayerWorking(client) {
	if(!getPlayerCurrentSubAccount(client)) {
		return false;
	}
	return getPlayerCurrentSubAccount(client).isWorking;
}

// ===========================================================================

function startJobRoute(client) {
	if(doesPlayerHaveJobType(client, VRR_JOB_BUS)) {
		let busRoute = getRandomBusRoute(getPlayerIsland(client));
		getPlayerData(client).jobRoute = busRoute;
		getPlayerData(client).jobRouteStop = 0;
		getPlayerData(client).jobRouteIsland = getPlayerIsland(client);
		getPlayerData(client).jobRouteVehicle = getPlayerVehicle(client);
		getPlayerVehicle(client).colour1 = getBusRouteData(getPlayerIsland(client), busRoute).busColour;
		getPlayerVehicle(client).colour2 = 1;
		showCurrentBusStop(client);
		messagePlayerNormal(client, `🚌 You are now driving the {ALTCOLOUR}${getBusRouteData(getPlayerIsland(client), busRoute).name} {MAINCOLOUR}bus route! Drive to the green checkpoint.`);
	} else if(doesPlayerHaveJobType(client, VRR_JOB_GARBAGE)) {
		let garbageRoute = getRandomBusRoute(getPlayerIsland(client));
		getPlayerData(client).jobRoute = garbageRoute;
		getPlayerData(client).jobRouteStop = 0;
		getPlayerData(client).jobRouteIsland = getPlayerIsland(client);
		getPlayerData(client).jobRouteVehicle = getPlayerVehicle(client);
		getPlayerVehicle(client).colour1 = getGarbageRouteData(getPlayerIsland(client), garbageRoute).garbageTruckColour;
		getPlayerVehicle(client).colour2 = 1;
		showCurrentGarbageStop(client);
		messagePlayerNormal(client, `🚌 You are now driving the {ALTCOLOUR}${getGarbageRouteData(getPlayerIsland(client), garbageRoute).name} {MAINCOLOUR}garbage route! Drive to the grey checkpoint.`);
	}
}

// ===========================================================================

function stopJobRoute(client, successful = false, alertPlayer = true) {
	stopReturnToJobVehicleCountdown(client);
	sendPlayerStopJobRoute(client);

	if(doesPlayerHaveJobType(client, VRR_JOB_BUS)) {
		respawnVehicle(getPlayerData(client).jobRouteVehicle);
		getPlayerData(client).jobRouteVehicle = false;
		getPlayerData(client).jobRoute = false;
		getPlayerData(client).jobRouteStop = false;
		getPlayerData(client).jobRouteIsland = false;

		if(alertPlayer) {
			messagePlayerAlert(client, `You stopped the ${getBusRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).name} bus route! Your bus has been returned to the bus depot.`, getColourByName("yellow"));
		}
	} else if(doesPlayerHaveJobType(client, VRR_JOB_GARBAGE)) {
		respawnVehicle(getPlayerData(client).jobRouteVehicle);
		getPlayerData(client).jobRouteVehicle = false;
		getPlayerData(client).jobRoute = false;
		getPlayerData(client).jobRouteStop = false;
		getPlayerData(client).jobRouteIsland = false;

		if(alertPlayer) {
			messagePlayerAlert(client, `You stopped the ${getGarbageRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).name} garbage route! Your trashmaster has been returned to the bus depot.`, getColourByName("yellow"));
		}
	} else if(doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		respawnVehicle(getPlayerData(client).jobRouteVehicle);
		getPlayerData(client).jobRouteVehicle = false;
		getPlayerData(client).jobRoute = false;
		getPlayerData(client).jobRouteStop = false;
		getPlayerData(client).jobRouteIsland = false;

		if(alertPlayer) {
			messagePlayerAlert(client, `You stopped the ${getPolicePatrolRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).name} patrol route! Your police car has been returned to the station.`, getColourByName("yellow"));
		}
	}
}

// ===========================================================================

function isPlayerOnJobRoute(client) {
	if(typeof getPlayerData(client).jobRoute == "number") {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerJobRouteVehicle(client) {
	if(!isPlayerOnJobRoute(client)) {
		return false;
	}

	return getPlayerData(client).jobRouteVehicle;
}

// ===========================================================================

function startReturnToJobVehicleCountdown(client) {
	getPlayerData(client).returnToJobVehicleTick = getGlobalConfig().returnToJobVehicleTime;
	getPlayerData(client).returnToJobVehicleTimer = setInterval(function() {
		//logToConsole(LOG_DEBUG, getPlayerData(client).returnToJobVehicleTick);
		if(getPlayerData(client).returnToJobVehicleTick > 0) {
			getPlayerData(client).returnToJobVehicleTick = getPlayerData(client).returnToJobVehicleTick - 1;
			//console.warn(`You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`);
			showGameMessage(client, `You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`, getColourByName("softRed"), 1500);
		} else {
			clearInterval(getPlayerData(client).returnToJobVehicleTimer);
			getPlayerData(client).returnToJobVehicleTimer = null;
			getPlayerData(client).returnToJobVehicleTick = 0;
			stopJobRoute(client, false);
		}
	}, 1000);
}

// ===========================================================================

function stopReturnToJobVehicleCountdown(client) {
	if(getPlayerData(client).returnToJobVehicleTimer != null) {
		clearInterval(getPlayerData(client).returnToJobVehicleTimer);
		getPlayerData(client).returnToJobVehicleTimer = null;
	}

	//getPlayerData(client).returnToJobVehicleTick = 0;
}

// ===========================================================================

function canPlayerUseJob(client, jobId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		return true;
	}

	if(!getJobData(jobId)) {
		return false;
	}

	if(isJobWhiteListed(jobId)) {
		if(!isPlayerOnJobWhiteList(client, jobId)) {
			return false;
		}
	}

	if(!isJobBlackListed(jobId)) {
		if(isPlayerOnJobBlackList(client, jobId)) {
			return false;
		}
	}

	return true;
}

// ===========================================================================

function deleteJobLocation(jobLocationData) {
	if(jobLocationData.pickup) {
		deleteGameElement(jobLocationData.pickup);
	}
}

// ===========================================================================

function freezeJobVehicleForRouteStop(client) {
    getVehicleData(getPlayerVehicle(client)).engine = false;
	getPlayerVehicle(client).engine = false;
}

// ===========================================================================

function unFreezeJobVehicleForRouteStop(client) {
    getVehicleData(getPlayerVehicle(client)).engine = true;
	getPlayerVehicle(client).engine = true;
}

// ===========================================================================

function getJobIdFromDatabaseId(databaseId) {
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function setAllJobDataIndexes() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].index = i;
		for(let j in getServerData().jobs[i].locations) {
			getServerData().jobs[i].locations[j].index = j;
			getServerData().jobs[i].locations[j].jobIndex = i;
		}

		for(let k in getServerData().jobs[i].uniforms) {
			getServerData().jobs[i].uniforms[k].index = k;
			getServerData().jobs[i].uniforms[k].jobIndex = i;
		}

		for(let m in getServerData().jobs[i].equipment) {
			getServerData().jobs[i].equipment[m].index = m;
			getServerData().jobs[i].equipment[m].jobIndex = i;
			for(let n in getServerData().jobs[i].equipment[m].items) {
				getServerData().jobs[i].equipment[m].items[n].index = n;
				getServerData().jobs[i].equipment[m].items[n].jobIndex = i;
				getServerData().jobs[i].equipment[m].items[n].equipmentIndex = m;
			}
		}

		for(let o in getServerData().jobs[i].blackList) {
			getServerData().jobs[i].blackList[o].index = o;
			getServerData().jobs[i].blackList[o].jobIndex = i;
		}

		for(let v in getServerData().jobs[i].whiteList) {
			getServerData().jobs[i].blackList[v].index = v;
			getServerData().jobs[i].blackList[v].jobIndex = i;
		}
	}
}

// ===========================================================================

function createJobLocation(jobId, position, interior, dimension) {
	let jobLocationData = new JobLocationData(false);
	jobLocationData.position = position;
	jobLocationData.job = getJobData(jobId).databaseId;
	jobLocationData.interior = interior;
	jobLocationData.dimension = dimension;
	jobLocationData.enabled = true;
	jobLocationData.jobIndex = jobId;

	getServerData().jobs[jobId].locations.push(jobLocationData);
	let newSlot = getServerData().jobs[jobId].locations.length-1;
	getServerData().jobs[jobId].locations[newSlot].index = newSlot;
	createJobLocationPickup(jobId, newSlot);
	saveJobLocationToDatabase(jobLocationData);
}

// ===========================================================================

function saveJobToDatabase(jobData) {
	if(jobData == null) {
		// Invalid job data
		return false;
	}

	if(!jobData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job ${jobData.name} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job ${jobData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobData.name);
		let data = [
			["job_name", safeName],
			["job_enabled", boolToInt(jobData.enabled)],
			["job_pickup", jobData.pickupModel],
			["job_blip", jobData.blipModel],
			["job_type", jobData.type],
			["job_colour_r", jobData.colourArray[0]],
			["job_colour_g", jobData.colourArray[1]],
			["job_colour_b", jobData.colourArray[2]],
			["job_walkietalkiefreq", jobData.walkieTalkieFrequency],
			["job_wl", jobData.whiteListEnabled],
			["job_bl", jobData.blackListEnabled],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_main", data, `job_id=${jobData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job ${jobData.name} to database!`);

	return false;
}

// ===========================================================================

function saveJobRouteToDatabase(jobRouteData) {
	if(!jobRouteData) {
		// Invalid job route data
		return false;
	}

	if(!jobRouteData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job route ${jobRouteData.name} (${jobRouteData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job route ${jobRouteData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRouteData.name);
		let data = [
			["job_route_job", jobRouteData.jobId],
			["job_route_enabled", boolToInt(jobRouteData.enabled)],
			["job_route_name", safeName],
			["job_route_col1_r", jobRouteData.vehicleColour1],
			["job_route_col2_r", jobRouteData.vehicleColour2],
			["job_route_start_msg", jobRouteData.startMessage],
			["job_route_finish_msg", jobRouteData.finishMessage],
			["job_route_pay", jobRouteData.pay],
			["job_route_detail", jobRouteData.detail],
		];

		let dbQuery = null;
		if(jobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_route", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobRouteData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_route", data, `job_route_id=${jobRouteData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobRouteData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job route ${jobRouteData.name} to database!`);

	return false;
}

// ===========================================================================

function saveJobRouteLocationsToDatabase(jobRouteLocationData) {
	if(!jobRouteLocationData) {
		// Invalid job route position data
		return false;
	}

	if(!jobRouteLocationData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job route location ${jobRouteLocationData.name} (${jobRouteLocationData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job route location ${jobRouteLocationData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRouteLocationData.name);
		let data = [
			["job_route_loc_route", jobRouteLocationData.routeId],
			["job_route_loc_enabled", boolToInt(jobRouteLocationData.enabled)],
			["job_route_loc_name", safeName],
			["job_route_loc_x", jobRouteLocationData.position.x],
			["job_route_loc_y", jobRouteLocationData.position.y],
			["job_route_loc_z", jobRouteLocationData.position.z],
			["job_route_loc_pay", jobRouteLocationData.pay],
			["job_route_loc_delay", jobRouteLocationData.stopDelay],
			["job_route_loc_prev", jobRouteLocationData.previousStop]
		];

		let dbQuery = null;
		if(jobRouteLocationData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_route_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobRouteLocationData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_route_loc", data, `job_route_loc_id=${jobRouteLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobRouteLocationData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job route location ${jobRoutePositionData.name} (${jobRouteLocationData.databaseId}) to database!`);

	return false;
}

// ===========================================================================

function saveJobLocationToDatabase(jobLocationData) {
	if(jobLocationData == null) {
		// Invalid job location data
		return false;
	}

	if(!jobLocationData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job location ${jobLocationData.name} (${jobLocationData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job location ${jobLocationData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let data = [
			["job_loc_job", jobLocationData.job],
			["job_loc_enabled", boolToInt(jobLocationData.enabled)],
			["job_loc_pos_x", jobLocationData.position.x],
			["job_loc_pos_y", jobLocationData.position.y],
			["job_loc_pos_z", jobLocationData.position.z],
			["job_loc_int", jobLocationData.interior],
			["job_loc_vw", jobLocationData.dimension],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobLocationData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_loc", data, `job_loc_id=${jobLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobLocationData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job location ${jobLocationData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobEquipmentToDatabase(jobEquipmentData) {
	if(jobEquipmentData == null) {
		// Invalid job equipment data
		return false;
	}

	if(!jobEquipmentData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment ${jobEquipmentData.name} (${jobEquipmentData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job equipment ${jobEquipmentData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobEquipmentData.name);
		let data = [
			["job_equip_job", jobEquipmentData.job],
			["job_equip_enabled", boolToInt(jobEquipmentData.enabled)],
			["job_equip_minrank", jobLocationData.requiredRank],
			["job_equip_name", safeName],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_equip", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobEquipmentData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_equip", data, `job_equip_id=${jobEquipmentData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobEquipmentData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job equipment ${jobEquipmentData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobEquipmentItemToDatabase(jobEquipmentItemData) {
	if(jobEquipmentItemData == null) {
		// Invalid job equipment weapon data
		return false;
	}

	if(!jobEquipmentItemData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment item ${jobEquipmentItemData.databaseId} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job equipment weapon ${jobEquipmentItemData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let data = [
			["job_equip_item_equip", jobEquipmentItemData.equipmentId],
			["job_equip_item_enabled", boolToInt(jobEquipmentItemData.enabled)],
			["job_equip_item_type", jobEquipmentItemData.itemType],
			["job_equip_item_value", jobEquipmentItemData.value],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_equip_item", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobEquipmentItemData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_equip_item", data, `job_equip_id=${jobEquipmentItemData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobEquipmentItemData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job equipment weapon ${jobEquipmentItemData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobUniformToDatabase(jobUniformData) {
	if(jobUniformData == null) {
		// Invalid job uniform data
		return false;
	}

	if(!jobUniformData.needSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job uniform ${jobUniformData.databaseId} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job uniform ${jobUniformData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobUniformData.name);
		let data = [
			["job_uniform_job", jobUniformData.jobId],
			["job_uniform_enabled", boolToInt(jobUniformData.enabled)],
			["job_uniform_minrank", jobUniformData.requiredRank],
			["job_uniform_name", safeName],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_uniform", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobUniformData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_uniform", data, `job_uniform_id=${jobUniformData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobUniformData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job uniform ${jobUniformData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveAllJobsToDatabase() {
	for(let i in getServerData().jobs) {
		saveJobToDatabase(getServerData().jobs[i]);

		for(let j in getServerData().jobs[i].locations) {
			saveJobLocationToDatabase(getServerData().jobs[i].locations[j]);
		}

		for(let k in getServerData().jobs[i].uniforms) {
			saveJobUniformToDatabase(getServerData().jobs[i].uniforms[k]);
		}

		for(let m in getServerData().jobs[i].equipment) {
			saveJobEquipmentToDatabase(getServerData().jobs[i].equipment[m]);

			for(let n in getServerData().jobs[i].equipment[m].items) {
				saveJobEquipmentItemToDatabase(getServerData().jobs[i].equipment[m].items[n]);
			}
		}

		for(let p in getServerData().jobs[i].routes) {
			saveJobRouteToDatabase(getServerData().jobs[i].routes[p]);

			for(let q in getServerData().jobs[i].routes[p].routes) {
				saveJobRouteLocationToDatabase(getServerData().jobs[i].routes[p].locations[q]);
			}
		}
	}
}

// ===========================================================================

function deleteJobLocationBlip(jobId, locationId) {
	if(getJobData(jobId).locations[locationId].blip != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].blip);
		getJobData(jobId).locations[locationId].blip = null;
	}
}

// ===========================================================================

function deleteJobLocationPickup(jobId, locationId) {
	if(getServerData().jobs[jobId].locations[locationId].pickup != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].pickup);
		getServerData().jobs[jobId].locations[locationId].pickup = null;
	}
}

// ===========================================================================

function createJobLocationPickup(jobId, locationId) {
	if(!getServerConfig().createJobPickups) {
		return false;
	}

	if(getJobData(jobId).pickupModel != -1) {
		let pickupModelId = getGameConfig().pickupModels[getServerGame()].job;

		if(getJobData(jobId).pickupModel != 0) {
			pickupModelId = getJobData(jobId).pickupModel;
		}

		getJobData(jobId).locations[locationId].pickup = createGamePickup(pickupModelId, getJobData(jobId).locations[locationId].position, getGameConfig().pickupTypes[getServerGame()].job);
		setElementDimension(getJobData(jobId).locations[locationId].pickup, getJobData(jobId).locations[locationId].dimension);
		setEntityData(getServerData().jobs[jobId].locations[locationId].pickup, "vrr.owner.type", VRR_PICKUP_JOB, false);
		setEntityData(getServerData().jobs[jobId].locations[locationId].pickup, "vrr.owner.id", locationId, false);
		setEntityData(getServerData().jobs[jobId].locations[locationId].pickup, "vrr.label.type", VRR_LABEL_JOB, true);
		setEntityData(getServerData().jobs[jobId].locations[locationId].pickup, "vrr.label.name", getJobData(jobId).name, true);
		setEntityData(getServerData().jobs[jobId].locations[locationId].pickup, "vrr.label.jobType", getJobData(jobId).databaseId, true);
		addToWorld(getJobData(jobId).locations[locationId].pickup);
	}
}

// ===========================================================================

function createJobLocationBlip(jobId, locationId) {
	if(!getServerConfig().createJobBlips) {
		return false;
	}

	if(getJobData(jobId).blipModel != -1) {
		let blipModelId = getGameConfig().blipSprites[getServerGame()].job;

		if(getJobData(jobId).blipModel != 0) {
			blipModelId = getJobData(jobId).blipModel;
		}

		getJobData(jobId).locations[locationId].blip = game.createBlip(getJobData(jobId).locations[locationId].position, blipModelId, getColourByType("job"));
		setElementStreamInDistance(getServerData().jobs[i].locations[j].blip, 30);
		setElementStreamOutDistance(getServerData().jobs[i].locations[j].blip, 40);
		//getJobData(jobId).locations[locationId].blip.onAllDimensions = false;
		getJobData(jobId).locations[locationId].blip.dimension = getJobData(jobId).locations[locationId].dimension;
		addToWorld(getJobData(jobId).locations[locationId].blip);
	}
}

// ===========================================================================

function getPlayerJob(client) {
	let jobDatabaseId = getPlayerCurrentSubAccount(client).job;
	for(let i in getServerData().jobs) {
		if(jobDatabaseId == getServerData().jobs[i].databaseId) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerUseJobs(client) {
	if(hasBitFlag(getPlayerData(client).accountData.flags.moderation, getServerBitFlags().moderationFlags.JobBanned)) {
		return false;
	}

	return true;
}

// ===========================================================================

function getJobIndexFromDatabaseId(databaseId) {
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function isJobWhiteListed(jobId) {
	return getJobData(jobId).whiteListEnabled;
}

// ===========================================================================

function isPlayerOnJobWhiteList(client, jobId) {
	for(let i in getJobData(jobId).whiteList) {
		if(getJobData(jobId).whiteList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isJobBlackListed(jobId) {
	return getJobData(jobId).blackListEnabled;
}

// ===========================================================================

function isPlayerOnJobBlackList(client, jobId) {
	for(let i in getJobData(jobId).blackList) {
		if(getJobData(jobId).blackList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function playerArrivedAtJobRouteStop(client) {
	if(!isPlayerOnJobRoute(client)) {
		return false;
	}

	if(isLastStopOnJobRoute(getPlayerData(client).jobRouteJobLocation, getPlayerData(client).jobRoute, getPlayerData(client).jobRouteStop)) {
        finishSuccessfulJobRoute(client);
        return false;
    }

	showGameMessage(client, getJobRouteData(getPlayerData(client).jobRoute).arriveAtLocationMessage, getJobData(getJobRouteData(getPlayerData(client).jobRoute).jobIndex).colour, 5000);
    freezeJobVehicleForRouteStop(client);

    getPlayerData(client).jobRouteStop = getNextStopOnJobRoute(getPlayerData(client).jobRoute, getJobRouteData(getPlayerData(client).jobRoute).jobLocation, getPlayerData(client).jobRouteStop);
    setTimeout(function() {
        unFreezeJobVehicleForRouteStop(client);
        showCurrentJobStop(client);
        showGameMessage(client, getJobRouteData(getPlayerData(client).jobRoute).nextLocationMessage, getJobData(getJobRouteData(getPlayerData(client).jobRoute).jobIndex).colour, 3500);
    }, 5000);
}

// ===========================================================================

function deleteJobItems(client) {
	for(let i in getPlayerData(client).jobEquipmentCache) {
		for(let j in getPlayerData(client).hotBarItems) {
			if(getPlayerData(client).hotBarItems[j] == getPlayerData(client).jobEquipmentCache[i]) {
				getPlayerData(client).hotBarItems[j] = -1;
			}
		}
		deleteItem(getPlayerData(client).jobEquipmentCache[i]);
	}

	updatePlayerHotBar(client);
}

// ===========================================================================

function getJobRankName(jobId, rankId) {
	return jobRankNames[jobId][rankId];
}

// ===========================================================================

function respawnPlayerLastJobVehicle(client) {
	if(getPlayerCurrentSubAccount(client).lastJobVehicle == null) {
		return false;
	}
	respawnVehicle(getPlayerCurrentSubAccount(client).lastJobVehicle);
}

// ===========================================================================

function resetAllJobBlips() {
	deleteAllJobBlips();
	createAllJobBlips();
}

// ===========================================================================

function resetAllJobPickups() {
	deleteAllJobPickups();
	createAllJobPickups();
}

// ===========================================================================

function deleteAllJobBlips() {
	for(let i in getServerData().jobs) {
		deleteJobBlips(i);
	}
}

// ===========================================================================

function deleteAllJobPickups() {
	for(let i in getServerData().jobs) {
		deleteJobPickups(i);
	}
}

// ===========================================================================

function deleteJobBlips(jobId) {
	for(let j in getServerData().jobs[jobId].locations) {
		deleteJobLocationBlip(jobId, j);
	}
}

// ===========================================================================

function deleteJobPickups(jobId) {
	for(let j in getServerData().jobs[jobId].locations) {
		deleteJobLocationPickup(jobId, j);
	}
}

// ===========================================================================

function createJobRouteCommand(command, params, client) {
	let jobId = getPlayerJob(client);

	if(!getJobData(jobId)) {
		messagePlayerError(client, `You need to take the job that you want to make a route for.`);
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, `You need to be working! Use /startwork at a job site.`);
		return false;
	}

	//messagePlayerSuccess(client, `{MAINCOLOUR}You now have the {jobYellow}${jobData.name} {MAINCOLOUR}job`);
	return true;
}

// ===========================================================================

function setAllJobIndexes() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].index = i;

		for(let j in getServerData().jobs[i].locations) {
			getServerData().jobs[i].locations[j].index = j;
			getServerData().jobs[i].locations[j].jobIndex = i;
		}

		for(let k in getServerData().jobs[i].uniforms) {
			getServerData().jobs[i].uniforms[k].index = k;
			getServerData().jobs[i].uniforms[k].jobIndex = i;
		}

		for(let m in getServerData().jobs[i].equipment) {
			getServerData().jobs[i].equipment[m].index = m;
			getServerData().jobs[i].equipment[m].jobIndex = i;

			for(let n in getServerData().jobs[i].equipment[m].items) {
				getServerData().jobs[i].equipment[m].items[n].index = n;
				getServerData().jobs[i].equipment[m].items[n].equipmentIndex = m;
			}
		}

		for(let p in getServerData().jobs[i].routes) {
			getServerData().jobs[i].routes[j].index = p;
			getServerData().jobs[i].routes[j].jobIndex = i;

			for(let q in getServerData().jobs[i].routes[p].locations) {
				getServerData().jobs[i].routes[p].items[q].index = n;
				getServerData().jobs[i].routes[p].items[q].routeIndex = p;
			}
		}
	}
}