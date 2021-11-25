// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy/financial utils, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEconomyScript() {
	logToConsole(LOG_INFO, "[VRR.Economy]: Initializing economy script ...");
	logToConsole(LOG_INFO, "[VRR.Economy]: Economy script initialized successfully!");
}

// ===========================================================================

function getTimeDisplayUntilPlayerPayDay(client) {
	return getTimeDifferenceDisplay(sdl.ticks-getPlayerData(client).payDayTickStart);
}

// ===========================================================================

function applyServerInflationMultiplier(value) {
	return toInteger(Math.round(value*getServerConfig().inflationMultiplier))
}

// ===========================================================================

function playerPayDay(client) {
	let wealth = calculateWealth(client);
	let taxAmount = calculateTax(wealth);
	let grossIncome = getPlayerData(client).payDayAmount;

	// Public Beta Bonus
	taxAmount = 0;
	grossIncome = grossIncome*2;
	grossIncome = grossIncome + 2000;

	let netIncome = grossIncome-taxAmount;

	messagePlayerAlert(client, "== Payday! =============================");
	messagePlayerInfo(client, `Paycheck: {ALTCOLOUR}$${grossIncome}`);
	messagePlayerInfo(client, `Taxes: {ALTCOLOUR}$${taxAmount}`);
	messagePlayerInfo(client, `You receive: {ALTCOLOUR}$${netIncome}`);

	givePlayerCash(client, netIncome);
}

// ===========================================================================

function calculateWealth(client) {
	// To-do
	return 0;
}

// ===========================================================================

function calculateTax(client) {
	// To-do
	return 0;
}

// ===========================================================================

function forcePlayerPayDayCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if(!targetClient) {
		messagePlayerError(client, "That player is not connected!");
		return false;
	}

	messageAdmins(`${client.name} gave ${targetClient.name} an instant payday`);
	playerPayDay(targetClient);
}

// ===========================================================================