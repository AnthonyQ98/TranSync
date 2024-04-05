function changeSignalTimings(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    let msg;
    if (request.intersectionId == "") {
        msg = "Invalid intersection - can not change traffic lights!"
    } else {
        msg = "------\nChanged intersection " + request.intersectionId + "\n" + request.signalTimings[0].color + " light duration (seconds) set to: " + request.signalTimings[0].durationSeconds + "\n" + request.signalTimings[1].color + " light duration (seconds) set to: " + request.signalTimings[1].durationSeconds + "\n------"
    }
    const response = {
        message: msg
    };
    callback(null, response);
}


module.exports = { changeSignalTimings };