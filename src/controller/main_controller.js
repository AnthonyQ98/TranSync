// Import required modules
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load protocol buffers for traffic lights service
const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

// Load protocol buffers for public transport service
const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;

// Load protocol buffers for parking service
const parkingPackageDefinition = protoloader.loadSync('protos/parking.proto', {});
const parkingProto = grpc.loadPackageDefinition(parkingPackageDefinition).Parking;

// Function to display the main menu options
function showMainMenu() {
    console.log("Transport Synchronization System:");
    console.log("1) Traffic Lights");
    console.log("2) Parking");
    console.log("3) Public Transport");
}

// Function to display the submenu options for parking
function showParkingSubMenu() {
    console.log("1) Check Availability");
    console.log("2) Reserve Spot");
}

// Function to handle traffic lights interactions
async function handleTrafficLights() {
    try {
        // Create gRPC client for traffic lights service
        const client = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());

        // Initialize the call for client-side streaming
        const call = client.ChangeSignalTimings(function (error, response) {
            if (error) {
                console.error(error);
            } else {
                console.log(response.message);
            }
        });

        // Prompt user for input and send requests
        while (true) {
            const intersectionId = await new Promise((resolve) => readline.question('Enter intersection ID (press Enter to exit): ', resolve));
            if (!intersectionId) {
                // If the user enters an empty string, end the streaming
                call.end();
                break;
            }

            // Get signal timings from user input
            const greenDuration = await new Promise((resolve) => readline.question('Enter duration for GREEN signal (in seconds): ', resolve));
            const redDuration = await new Promise((resolve) => readline.question('Enter duration for RED signal (in seconds): ', resolve));

            // Prepare request body with intersection ID and signal timings
            const request = {
                intersectionId: intersectionId,
                signalTimings: [
                    { color: "GREEN", durationSeconds: parseInt(greenDuration) },
                    { color: "RED", durationSeconds: parseInt(redDuration) },
                ]
            };

            // Send request to the server
            call.write(request);
        }
    } catch (error) {
        console.error('Error handling traffic lights:', error.message)
    }
}

// Function to handle public transport interactions
async function handlePublicTransport() {
    try {
        // Create gRPC client for public transport service
        const client = new publicTransportProto.PublicTransport('localhost:50051', grpc.credentials.createInsecure());

        // Initialize the call for bidirectional streaming
        const call = client.GetNextBus();

        // Set up event listeners for receiving responses
        call.on('data', function (response) {
            // Process each response received from the server
            console.log('Received response:', response);
        });

        call.on('end', function () {
            // Handle the end of the streaming
            console.log('Streaming ended');
        });

        // Prompt user for input and send requests
        while (true) {
            const busStopId = await new Promise((resolve) => readline.question('Enter Bus Stop ID (press Enter to exit): ', resolve));
            if (!busStopId) {
                // If the user enters an empty string, end the streaming
                call.end();
                break;
            }
            // Send request to the server
            call.write({ busStopId: busStopId });
        }
    } catch (error) {
        console.error('Error handling public transport bus information:', error.message)
    }
}

// Function to handle parking interactions - Check Availability
async function handleParkingCheckAvailability() {
    try {
        // Create gRPC client for parking service
        const client = new parkingProto.Parking('localhost:50051', grpc.credentials.createInsecure());

        // Get parking lot ID from user input
        const parkingLotId = await new Promise((resolve) => readline.question('Enter Parking Lot ID: ', resolve));

        // Initialize the call for server-side streaming
        const call = client.CheckAvailability({ parkingLotId: parkingLotId });

        // Set up event listener for receiving responses
        call.on('data', function (response) {
            // Process each response received from the server
            const message = `Available spots at ${parkingLotId}: ${response.availableSpots}`;
            console.log(message);
        });

        call.on('end', function () {
            // Handle the end of the streaming
            console.log('Streaming ended');
        });

        // Wait for user input to end the streaming
        await new Promise((resolve) => readline.question('Press Enter to end streaming...', resolve));

        // End the streaming
        call.cancel();
    } catch (error) {
        console.error('Error checking parking availability:', error.message)
    }
}

// Function to handle parking interactions - Reserve Spot
async function handleParkingReserveSpot() {
    try {
        // Create gRPC client for parking service
        const client = new parkingProto.Parking('localhost:50051', grpc.credentials.createInsecure());
        // Get parking lot ID and number of spots to reserve from user input
        const parkingLotId = await new Promise((resolve) => readline.question('Enter Parking Lot ID: ', resolve));
        const numSpots = await new Promise((resolve) => readline.question('Which spot would you like to reserve: ', resolve));

        // Prepare request body with parking lot ID and number of spots to reserve
        const body = {
            parkingLotId: parkingLotId,
            numSpots: parseInt(numSpots)
        };

        // Call ReserveSpot RPC method and handle response
        client.ReserveSpot(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                console.log(response.message);
            }
        });
    } catch (error) {
        console.error('Error handling parking spot reservation:', error.message)
    }
}

// Main function to display the main menu and handle user choices
function main() {
    showMainMenu();

    try {
        readline.question('Enter your choice: ', async function (choice) {
            switch (choice) {
                case '1':
                    await handleTrafficLights(); // Handle traffic lights
                    break;
                case '2':
                    showParkingSubMenu(); // Display parking submenu
                    readline.question('Enter your choice: ', async function (choice2) {
                        switch (choice2) {
                            case '1':
                                await handleParkingCheckAvailability(); // Handle parking - Check Availability
                                break;
                            case '2':
                                await handleParkingReserveSpot(); // Handle parking - Reserve Spot
                                break;
                            default:
                                console.log("Invalid choice");
                        }
                        readline.close();
                    });
                    break;
                case '3':
                    await handlePublicTransport(); // Handle public transport
                    readline.close();
                    break;
                default:
                    console.log("Invalid choice");
                    readline.close();
            }
        });
    } catch (error) {
        console.error("Error handling main menu or sub menus:", error.message);
    }

}

// Execute the main function
main();
