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
        // Get intersection ID from user input
        const intersectionId = await new Promise((resolve) => readline.question('Enter intersection ID: ', resolve));
        // Get signal timings from user input
        const greenDuration = await new Promise((resolve) => readline.question('Enter duration for GREEN signal (in seconds): ', resolve));
        const redDuration = await new Promise((resolve) => readline.question('Enter duration for RED signal (in seconds): ', resolve));

        // Prepare request body with intersection ID and signal timings
        const body = {
            intersectionId: intersectionId,
            signalTimings: [
                { color: "GREEN", durationSeconds: parseInt(greenDuration) },
                { color: "RED", durationSeconds: parseInt(redDuration) },
            ]
        };

        // Call ChangeSignalTimings RPC method and handle response
        client.ChangeSignalTimings(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                console.log(response.message);
            }
        });
    } catch (error) {
        console.error('Error handling traffic lights:', error.message)
    }
}

// Function to handle public transport interactions
async function handlePublicTransport() {
    try {
        // Create gRPC client for public transport service
        const client = new publicTransportProto.PublicTransport('localhost:50051', grpc.credentials.createInsecure());
        // Get bus stop ID from user input
        const busStopId = await new Promise((resolve) => readline.question('Enter Bus Stop ID: ', resolve));

        // Prepare request body with bus stop ID
        const body = {
            busStopId: busStopId,
        };

        // Call GetNextBus RPC method and handle response
        client.GetNextBus(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                // Construct and display message with bus information
                let message;
                if (response.busNumber == "") {
                    message = "Invalid bus number"
                } else {
                    message = `Bus Stop ID: ${body.busStopId}\nNext bus: ${response.busNumber}\nArriving: ${response.arrivalTime}`
                }
                console.log(message);
            }
        });
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

        // Prepare request body with parking lot ID
        const body = {
            parkingLotId: parkingLotId,
        };

        // Call CheckAvailability RPC method and handle response
        client.CheckAvailability(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                // Display message with available spots information
                const message = `Available spots at ${parkingLotId}: ${response.availableSpots}`;
                console.log(message);
            }
        });
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
