function changeSignalTimings(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        message: "------\nChanged intersection " + request.intersectionId + "\n" + request.signalTimings[0].color + " light duration (seconds) set to: " + request.signalTimings[0].durationSeconds + "\n" + request.signalTimings[1].color + " light duration (seconds) set to: " + request.signalTimings[1].durationSeconds + "\n------"
    };
    callback(null, response);
}


module.exports = { changeSignalTimings };