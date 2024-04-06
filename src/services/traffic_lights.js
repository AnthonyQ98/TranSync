// Function to handle changing signal timings
function changeSignalTimings(call, callback) {
    try {
        // Extract the request from the gRPC call
        const request = call.request;
        // Log the received request for debugging purposes
        console.log('Received request:', request);

        let msg;
        // Check if the intersection ID is empty
        if (request.intersectionId == "") {
            // If the intersection ID is empty, indicate that the intersection is invalid and cannot change traffic lights
            msg = "Invalid intersection - cannot change traffic lights!"
        } else {
            // If the intersection ID is not empty, construct a message indicating the changed signal timings
            msg = "------\nChanged intersection " + request.intersectionId + "\n" + request.signalTimings[0].color + " light duration (seconds) set to: " + request.signalTimings[0].durationSeconds + "\n" + request.signalTimings[1].color + " light duration (seconds) set to: " + request.signalTimings[1].durationSeconds + "\n------"
        }
        // Prepare the response with the message indicating the status of the signal timing change operation
        const response = {
            message: msg
        };
        // Send the response back to the client
        callback(null, response);
    } catch (error) {
        // Handle any errors that occur during processing
        console.error('Error handling traffic lights:', error.message)
    }
}

// Export the changeSignalTimings function to make it accessible from other modules
module.exports = { changeSignalTimings };
