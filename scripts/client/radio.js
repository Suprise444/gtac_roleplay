// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: radio.js
// DESC: Provides internet streaming radio functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function playStreamingRadio(url, loop, volume, element = false) {
    if(url == "") {
        if(streamingRadio != null) {
            streamingRadio.stop();
        }
        return true;
    }

    if(streamingRadio != null) {
        streamingRadio.stop();
    }

    streamingRadioVolume = volume;

    streamingRadio = audio.createSoundFromURL(url, loop);
    streamingRadio.volume = volume/100;
    streamingRadio.play();
}

// ===========================================================================

function stopStreamingRadio() {
    streamingRadio.stop();
    streamingRadio = null;
}

// ===========================================================================

function setStreamingRadioVolume(volume) {
    if(streamingRadio != null) {
        streamingRadioVolume = volume;
        streamingRadio.volume = volume/100;
    }
}

// ===========================================================================