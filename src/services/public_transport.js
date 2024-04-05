function getNextBus(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    let bus_number, arrival_time;
    if (request.busStopId == "") {
        bus_number = ""
        arrival_time = ""
    } else {
        bus_number = "308"
        arrival_time = "13:20"
    }
    const response = {
        busNumber: bus_number,
        arrivalTime: arrival_time
    };
    message = `Bus Stop ID: ${request.busStopId}\nNext bus: ${response.busNumber}\nArriving: ${response.arrivalTime}`
    console.log(response);
    callback(null, response);
}

module.exports = { getNextBus };