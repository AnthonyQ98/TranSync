// Function to handle checking availability of parking spots
function checkAvailability(call) {
    try {
        const request = call.request;
        console.log('Received request:', request);

        let spots;
        // Check if parking lot ID is empty
        if (request.parkingLotId == "") {
            spots = 0; // No spots available
        } else {
            spots = 50; // Assume there are 50 spots available
        }
        // Send each response with available spots count
        for (let i = 0; i < spots; i++) {
            // Prepare response with available spots count
            const response = {
                availableSpots: spots - i
            };
            // Send response back to client
            call.write(response);
        }
        // End the streaming once all responses are sent
        call.end();
    } catch (error) {
        // Handle errors during request processing
        console.error("Error handling client request for checking availability:", error.message)
    }
}

// Function to handle reserving parking spots
function reserveSpot(call, callback) {
    try {
        const request = call.request;
        console.log('Received request:', request);

        let msg;
        // Check if parking lot ID is empty or number of spots is invalid
        if (request.parkingLotId == "" || request.numSpots < 0) {
            msg = "ERROR: enter a valid parking lot or parking spot number!"
        } else {
            // Reservation successful message
            msg = "You have successfully reserved parking spot " + request.numSpots + " at " + request.parkingLotId
        }
        // Prepare response with reservation status message
        const response = {
            message: msg
        };
        // Send response back to client
        callback(null, response);
    } catch (error) {
        // Handle errors during request processing
        console.error("Error handling client request for reservation of parking space:", error.message)
    }
}

// Export functions to make them accessible from other modules
module.exports = { checkAvailability, reserveSpot };
