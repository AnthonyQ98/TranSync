// Function to handle getting information about the next bus
function getNextBus(call, callback) {
    try {
        // Extract the request from the gRPC call
        const request = call.request;
        // Log the received request for debugging purposes
        console.log('Received request:', request);

        let bus_number, arrival_time;
        // Check if the bus stop ID is empty
        if (request.busStopId == "") {
            // If the bus stop ID is empty, set bus number and arrival time to empty strings
            bus_number = ""
            arrival_time = ""
        } else {
            // If the bus stop ID is not empty, assume a static bus number and arrival time
            bus_number = "308"
            arrival_time = "13:20"
        }
        // Prepare the response with the bus number and arrival time
        const response = {
            busNumber: bus_number,
            arrivalTime: arrival_time
        };
        // Compose a message summarizing the next bus details for logging
        message = `Bus Stop ID: ${request.busStopId}\nNext bus: ${response.busNumber}\nArriving: ${response.arrivalTime}`
        // Log the response for debugging purposes
        console.log(response);
        // Send the response back to the client
        callback(null, response);
    } catch (error) {
        // Handle any errors that occur during processing
        console.error("Error handling request for next bus:", error.message)
    }
}

// Export the getNextBus function to make it accessible from other modules
module.exports = { getNextBus };
