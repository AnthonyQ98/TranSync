function checkAvailability(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    let spots;
    if (request.parkingLotId == "") {
        spots = 0;
    } else {
        spots = 50;
    }
    const response = {
        availableSpots: spots
    };
    callback(null, response);
}

function reserveSpot(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    let msg;
    if (request.parkingLotId == "" || request.numSpots < 0) {
        msg = "ERROR: enter a valid parking lot or parking spot number!"
    } else {
        msg = "You have successully reserved parking spot " + request.numSpots + " at " + request.parkingLotId
    }
    const response = {
        message: msg
    };
    callback(null, response);
}

module.exports = { checkAvailability, reserveSpot };