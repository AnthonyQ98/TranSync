function getNextBus(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        busNumber: "308",
        arrivalTime: "13:20"
    };
    callback(null, response);
}

module.exports = { getNextBus };