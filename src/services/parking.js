function checkAvailability(call, callback) {
    try {
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
    } catch (error) {
        console.error("Error handling client request for checking availability:", error.message)
    }

}

function reserveSpot(call, callback) {
    try {
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
    } catch (error) {
        console.error("Error handling client request for reservation of parking space:", error.message)
    }

}

module.exports = { checkAvailability, reserveSpot };