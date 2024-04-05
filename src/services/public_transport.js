function getNextBus(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        busNumber: "308",
        arrivalTime: "13:20",
    };
    message = `Bus Stop ID: ${request.busStopId}\nNext bus: ${response.busNumber}\nArriving: ${response.arrivalTime}`
    console.log(response);
    callback(null, response);
}

module.exports = { getNextBus };