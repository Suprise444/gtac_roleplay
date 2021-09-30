// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

let weaponSlots = [
    false,
    [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
    ],
    [
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        6,
        6,
        8,
        8,
        7,
        7,
        7,
        7,
        9,
        -1,
        9,
    ],
    [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        8,
        8,
        8,
        -1,
        -1,
        -1,
        2,
        2,
        2,
        3,
        3,
        3,
        4,
        4,
        5,
        5,
        4,
        6,
        6,
        7,
        7,
        7,
        7,
        8,
        12,
        9,
        9,
        9,
        9,
        9,
        11,
        9,
        9,
        9,
    ],
];

function openAllGarages() {
    switch(gta.game) {
        case GAME_GTA_III:
            for(let i=0;i<=26;i++) {
                openGarage(i);
                //gta.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
            }
            break;

        case GAME_GTA_VC:
            for(let i=0;i<=32;i++) {
                openGarage(i);
                //gta.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
            }
            break;

        case GAME_GTA_SA:
            for(let i=0;i<=44;i++) {
                openGarage(i);
            }
            break;

        default:
            break;
    }
}

// ===========================================================================

function closeAllGarages() {
    switch(gta.game) {
        case GAME_GTA_III:
            for(let i=0;i<=26;i++) {
                closeGarage(i);
                //gta.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
            }
            break;

        case GAME_GTA_VC:
            for(let i=0;i<=32;i++) {
                closeGarage(i);
                //gta.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
            }
            break;

        case GAME_GTA_SA:
            for(let i=0;i<=44;i++) {
                closeGarage(i);
            }
            break;

        default:
            break;
    }
}

// ===========================================================================

function setLocalPlayerFrozenState(state) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting frozen state to ${state}`);
    gui.showCursor(state, !state);
}

// ===========================================================================

function setLocalPlayerControlState(controlState, cursorState = false) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting control state to ${controlState} (Cursor: ${cursorState})`);
    controlsEnabled = controlState;
    //localPlayer.invincible = true;
    //if(getGame() != GAME_GTA_IV) {
    //    localPlayer.collisionsEnabled = controlState;
    //    localPlayer.invincible = false;
    //}
}

// ===========================================================================

function fadeLocalCamera(state, time) {
    if(isFadeCameraSupported()) {
        logToConsole(LOG_DEBUG, `[VRR.Utilities] Fading camera ${(state)?"in":"out"} for ${time} seconds`);

        if(isFadeCameraSupported()) {
            gta.fadeCamera(state, time);
        }
    }
}

// ===========================================================================

function removeLocalPlayerFromVehicle() {
    localPlayer.removeFromVehicle();
}

// ===========================================================================

function restoreLocalCamera() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Camera restored`);
    if(isCustomCameraSupported()) {
        gta.restoreCamera(true);
    }
};

// ===========================================================================

function clearLocalPlayerOwnedPeds() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing all self-owned peds ...`);
    clearSelfOwnedPeds();
    logToConsole(LOG_DEBUG, `[VRR.Utilities] All self-owned peds cleared`);
};

// ===========================================================================

function setLocalCameraLookAt(cameraPosition, cameraLookAt) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Set camera to look at [${cameraLookAt.x}, ${cameraLookAt.y}, ${cameraLookAt.z}] from [${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}]`);
    if(isCustomCameraSupported()) {
        gta.setCameraLookAt(cameraPosition, cameraLookAt, true);
    }
}

// ===========================================================================

function setCityAmbienceState(state, clearElements = false) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Ambient civilians and traffic ${(state) ? "enabled" : "disabled"}`);
    game.setTrafficEnabled(state);

    if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
        gta.setGenerateCarsAroundCamera(state);
        if(gta.game != GAME_GTA_SA) {
            gta.setCiviliansEnabled(state);
        }

        if(clearElements) {
            clearSelfOwnedPeds();
            clearSelfOwnedVehicles();
        }
    }
}

// ===========================================================================

function runClientCode(code, returnTo) {
	let returnValue = "Nothing";
	try {
		returnValue = eval("(" + code + ")");
	} catch(error) {
		triggerNetworkEvent("vrr.runCodeFail", returnTo, code);
		return false;
    }
    triggerNetworkEvent("vrr.runCodeSuccess", returnTo, code, returnValue);
}

// ===========================================================================

function enterVehicleAsPassenger() {
	if(localPlayer.vehicle == null) {
		let tempVehicle = getClosestVehicle(localPlayer.position);
		if(tempVehicle != null) {
			localPlayer.enterVehicle(tempVehicle, false);
		}
	}
}

// ===========================================================================

function giveLocalPlayerWeapon(weaponId, ammo, active) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Giving weapon ${weaponId} with ${ammo} ammo`);
    localPlayer.giveWeapon(weaponId, ammo, active);
    forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(weaponId));
    forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(weaponId));
    forceWeapon = weaponId;
}

// ===========================================================================

function giveLocalPlayerWeapon(weaponId, ammo, active) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Giving weapon ${weaponId} with ${ammo} ammo`);
    localPlayer.giveWeapon(weaponId, ammo, active);
    forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(weaponId));
    forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(weaponId));
    forceWeapon = weaponId;
}

// ===========================================================================

function clearLocalPlayerWeapons() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing weapons`);
    localPlayer.clearWeapons();
    forceWeapon = 0;
    forceWeaponAmmo = 0;
    forceWeaponClipAmmo = 0;
}

// ===========================================================================

function getClosestVehicle(pos) {
    return getVehicles().reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
}

// ===========================================================================

function setLocalPlayerPosition(position) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting position to ${position.x}, ${position.y}, ${position.z}`);
    localPlayer.velocity = toVector3(0.0, 0.0, 0.0);
    localPlayer.position = position;
}

// ===========================================================================

function setLocalPlayerHeading(heading) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting heading to ${heading}`);
    localPlayer.heading = heading;
}

// ===========================================================================

function setLocalPlayerInterior(interior) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting interior to ${interior}`);
    if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
        if(!isGTAIV()) {
            localPlayer.interior = interior;
            gta.cameraInterior = interior;
        }
    }

    let vehicles = getElementsByType(ELEMENT_VEHICLE);
    for(let i in vehicles) {
        if(getEntityData(vehicles[i], "vrr.interior")) {
            vehicles[i].interior = getEntityData(vehicles[i], "vrr.interior");
        }
    }
}

// ===========================================================================

function setSnowState(fallingSnow, groundSnow) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting falling snow to ${fallingSnow} and ground snow to ${groundSnow}`);
    if(!isNull(snowing)) {
        snowing = fallingSnow;
        forceSnowing(groundSnow);
    }
}

// ===========================================================================

function setLocalPlayerHealth(health) {
    localPlayer.health = health;
}

// ===========================================================================

function isSnowEnabled() {
    return (typeof snowing != "undefined");
}

// ===========================================================================

function playPedSpeech(pedName, speechId) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Making ${pedName}'s ped talk (${speechId})`);
    if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
        gta.SET_CHAR_SAY(int, int);
    }
}

// ===========================================================================

function clearLocalPedState() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing local ped state`);
    localPlayer.clearObjective();
}

// ===========================================================================

function getWeaponSlot(weaponId) {
	return weaponSlots[game.game][weaponId];
}

// ===========================================================================

function setLocalPlayerDrunkEffect(amount, duration) {
    if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
        logToConsole(LOG_DEBUG, `[VRR.Utilities] Drunk effect set to ${amount} for ${duration}ms`);
        drunkEffectAmount = 0;
        drunkEffectDurationTimer = setInterval(function() {
            drunkEffectAmount = drunkEffectAmount;
            if(drunkEffectAmount > 0) {
                gta.SET_MOTION_BLUR(drunkEffectAmount);
            } else {
                clearInterval(drunkEffectDurationTimer);
                drunkEffectDurationTimer = null;
            }
        }, 1000);
    }
}

// ===========================================================================

function getLocalPlayerVehicleSeat() {
    for(let i = 0 ; i <= 4 ; i++) {
        if(localPlayer.vehicle.getOccupant(i) == localPlayer) {
            return i;
        }
    }
}

// ===========================================================================

function clearSelfOwnedPeds() {
    logToConsole(LOG_DEBUG, `Clearing self-owned peds`);
    getElementsByType(ELEMENT_PED).forEach(function(ped) {
        //if(ped.isOwner) {
            destroyElement(ped);
        //}
    });
}

// ===========================================================================

function clearSelfOwnedVehicles() {
    logToConsole(LOG_DEBUG, `Clearing self-owned vehicles`);
    getElementsByType(ELEMENT_VEHICLE).forEach(function(vehicle) {
        //if(vehicle.isOwner) {
            destroyElement(vehicle);
        //}
    });
}

// ===========================================================================

function setMouseCameraState(state) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(state)?"Enabled":"Disabled"} mouse camera`);
    mouseCameraEnabled = state;
    SetStandardControlsEnabled(!mouseCameraEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(!gui.cursorEnabled)?"Enabled":"Disabled"} mouse cursor`);
    gui.showCursor(!gui.cursorEnabled, gui.cursorEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(!gui.cursorEnabled)?"Enabled":"Disabled"} mouse cursor`);
    setMouseCameraState(!mouseCameraEnabled);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(clientName, eventType) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Set ${clientName} damage event type to ${eventType}`);
    weaponDamageEvent[clientName] = eventType;
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(clientName, state) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(state)?"Enabled":"Disabled"} damage from ${clientName}`);
    weaponDamageEnabled[clientName] = state;
}

// ===========================================================================

function setLocalPlayerCash(amount) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting local player money`);
    localPlayer.money = toInteger(amount);
}

// ===========================================================================

function removeWorldObject(model, position, range) {
    if(isRemovingWorldObjectsSupported()) {
        logToConsole(LOG_DEBUG, `[VRR.Utilities] Removing world object ${model} at X: ${position.x}, Y: ${position.x}, Z: ${position.x} with range of ${range}`);

        if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
            game.removeWorldObject(model, position, range);
        }
    }
}

// ===========================================================================

function excludeModelFromGroundSnow(model) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Disabling ground snow for object model ${model}`);
    groundSnow.excludeModel(model);
}

// ===========================================================================

function destroyAutoCreatedPickups() {
    if(arePickupsSupported()) {
        getElementsByType(ELEMENT_PICKUP).forEach(function(pickup) {
            if(pickup.isOwner) {
                destroyElement(pickup);
            }
        });
    }
}

// ===========================================================================

function processLocalPlayerControlState() {
    if(localPlayer == null) {
        return false;
    }

    if(isSpawned) {
        return false;
    }

    if(!controlsEnabled) {
        clearLocalPedState();
    }
}

// ===========================================================================

function processWantedLevelReset() {
    if(localPlayer == null) {
        return false;
    }

    if(isSpawned) {
        return false;
    }

    localPlayer.wantedLevel = 0;
}

// ===========================================================================

function processLocalPlayerVehicleControlState() {
    let position = getLocalPlayerPosition();

    if(inVehicle && localPlayer.vehicle != null) {
        if(!localPlayer.vehicle.engine) {
            localPlayer.vehicle.velocity = toVector3(0.0, 0.0, 0.0);
            localPlayer.vehicle.turnVelocity = toVector3(0.0, 0.0, 0.0);
            if(parkedVehiclePosition) {
                localPlayer.vehicle.position = parkedVehiclePosition;
                localPlayer.vehicle.heading = parkedVehicleHeading;
            }
        } else {
            if(parkedVehiclePosition) {
                parkedVehiclePosition = false;
                parkedVehicleHeading = false;
            }
        }
    }
}

// ===========================================================================

function processLocalPlayerSphereEntryExitHandling() {
    let position = getLocalPlayerPosition();

    getElementsByType(ELEMENT_MARKER).forEach(function(sphere) {
        if(getDistance(position, sphere.position) <= sphere.radius) {
            if(!inSphere) {
                inSphere = sphere;
                triggerEvent("OnLocalPlayerEnterSphere", null, sphere);
            }
        } else {
            if(inSphere) {
                inSphere = false;
                triggerEvent("OnLocalPlayerExitSphere", null, sphere);
            }
        }
    });
}

// ===========================================================================

function processJobRouteSphere() {
    if(gta.game == GAME_GTA_SA) {
        let position = getLocalPlayerPosition();
        if(jobRouteStopSphere != null) {
            if(getDistance(position, jobRouteStopSphere.position) <= 2.0) {
                enteredJobRouteSphere();
            }
        }
    }
}

// ===========================================================================

function forceLocalPlayerEquippedWeaponItem() {
    if(forceWeapon != 0) {
        if(localPlayer.weapon != forceWeapon) {
            localPlayer.weapon = forceWeapon;
            localPlayer.setWeaponClipAmmunition(getWeaponSlot(forceWeapon), forceWeaponClipAmmo);
            localPlayer.setWeaponAmmunition(getWeaponSlot(forceWeapon), forceWeaponAmmo);
        } else {
            forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(forceWeapon));
            forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(forceWeapon));
        }
    } else {
        if(localPlayer.weapon > 0) {
            localPlayer.clearWeapons();
        }
    }
}

// ===========================================================================

function getLocalPlayerPosition() {
    let position = localPlayer.position;
    if(localPlayer.vehicle) {
        position = localPlayer.vehicle.position;
    }

    return position;
}

// ===========================================================================

function processLocalPlayerVehicleEntryExitHandling() {
    if(localPlayer.vehicle) {
        if(!inVehicle) {
            inVehicle = localPlayer.vehicle;
            inVehicleSeat = getLocalPlayerVehicleSeat();
            triggerEvent("OnLocalPlayerEnteredVehicle", inVehicle, inVehicleSeat);
        }
    } else {
        if(inVehicle) {
            triggerEvent("OnLocalPlayerExitedVehicle", inVehicle, inVehicleSeat);
            inVehicle = false;
            inVehicleSeat = false;
        }
    }
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicleArg) {
    // Soon this will also be used to get the IV vehicle via it's ID
    return vehicleArg;
}

// ===========================================================================

function getPosInFrontOfPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos(angle+(Math.PI/2)))*distance));
	let y = (pos.y+((Math.sin(angle+(Math.PI/2)))*distance));
	let z = pos.z;

	return toVector3(x, y, z);
}

// ===========================================================================

function getAllowedSkinIndexBySkinId(skinId) {
    for(let i in allowedSkins[game.game]) {
        if(skinId == allowedSkins[game.game][i][0]) {
            return i;
        }
    }
    return -1;
}

// ===========================================================================

function setMinuteDuration(minuteDuration) {
    logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting minute duration to ${minuteDuration}ms`);

    if(isTimeSupported()) {
        gta.time.minuteDuration = minuteDuration;
    }
}

// ===========================================================================

function getStreamingRadioVolumeForPosition(position) {
    return streamingRadioVolume;
}

// ===========================================================================

function getLocalPlayerLookAtPosition() {
    if(localPlayer != null) {
		let centerCameraPos = getWorldFromScreenPosition(toVector3(game.width/2, game.height/2, 0));
		return getWorldFromScreenPosition(toVector3(game.width/2, game.height/2, getDistance(centerCameraPos, localPlayer.position)+20));
	}
}

// ===========================================================================

function processInteriorLightsRendering() {
    if(renderInteriorLights) {
        if(!interiorLightsEnabled) {
            graphics.drawRectangle(null, toVector2(0.0, 0.0), toVector2(game.width, game.height), interiorLightsColour, interiorLightsColour, interiorLightsColour, interiorLightsColour);
        }
    }
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if(isNaN(params)) {
		for(let i in clients) {
			if(!clients[i].console) {
				if(toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if(typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}

// ===========================================================================

function processNearbyPickups() {
    let pickups = getElementsByType(ELEMENT_PICKUP);
    for(let i in pickups) {
        if(getDistance(pickups[i].position, localPlayer.position) < 5) {
            //if(pickups[i].interior == localPlayer.interior && pickups[i].dimension == localPlayer.dimension) {
                if(currentPickup != pickups[i]) {
                    currentPickup = pickups[i];
                    triggerNetworkEvent("vrr.pickup", pickups[i].id);
                }
            //}
        }
    }
}

// ===========================================================================