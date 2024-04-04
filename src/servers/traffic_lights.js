function changeSignalTimings(call, callback) {
    const request = call.request;
    console.log('Received request:', request);

    const response = {
        message: "Signal timings changed successfully"
    };
    callback(null, response);
}

module.exports = { changeSignalTimings };