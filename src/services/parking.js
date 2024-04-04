function checkAvailability(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        availableSpots: 9
    };
    callback(null, response);
}

function reserveSpot(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        message: "Successfully reserved this space!"
    };
    callback(null, response);
}

module.exports = { checkAvailability, reserveSpot };