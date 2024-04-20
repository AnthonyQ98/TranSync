// Function to handle getting information about the next bus
function getNextBus(call) {
    call.on('data', function (request) {
        // Handle each incoming request
        console.log('Received request:', request);
        // Simulate processing by sending a response
        const response = {
            busNumber: "308",
            arrivalTime: "13:20"
        };
        // Send the response back to the client
        call.write(response);
    });

    call.on('end', function () {
        // Once client stops sending requests, end the call
        call.end();
    });
}

// Export the getNextBus function to make it accessible from other modules
module.exports = { getNextBus };
