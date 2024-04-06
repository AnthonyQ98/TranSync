const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;

const parkingPackageDefinition = protoloader.loadSync('protos/parking.proto', {});
const parkingProto = grpc.loadPackageDefinition(parkingPackageDefinition).Parking;

function showMainMenu() {
    console.log("Transport Synchronization System:");
    console.log("1) Traffic Lights");
    console.log("2) Parking");
    console.log("3) Public Transport");
}

function showParkingSubMenu() {
    console.log("1) Check Availability");
    console.log("2) Reserve Spot");
}


async function handleTrafficLights() {
    try {
        const client = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());
        const intersectionId = await new Promise((resolve) => readline.question('Enter intersection ID: ', resolve));
        const greenDuration = await new Promise((resolve) => readline.question('Enter duration for GREEN signal (in seconds): ', resolve));
        const redDuration = await new Promise((resolve) => readline.question('Enter duration for RED signal (in seconds): ', resolve));

        const body = {
            intersectionId: intersectionId,
            signalTimings: [
                { color: "GREEN", durationSeconds: parseInt(greenDuration) },
                { color: "RED", durationSeconds: parseInt(redDuration) },
            ]
        };

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

async function handlePublicTransport() {
    try {
        const client = new publicTransportProto.PublicTransport('localhost:50051', grpc.credentials.createInsecure());
        const busStopId = await new Promise((resolve) => readline.question('Enter Bus Stop ID: ', resolve));


        const body = {
            busStopId: busStopId,
        };

        client.GetNextBus(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
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

async function handleParkingCheckAvailability() {
    try {
        const client = new parkingProto.Parking('localhost:50051', grpc.credentials.createInsecure());
        const parkingLotId = await new Promise((resolve) => readline.question('Enter Parking Lot ID: ', resolve));


        const body = {
            parkingLotId: parkingLotId,
        };

        client.CheckAvailability(body, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                message = `Available spots at ${parkingLotId}: ${response.availableSpots}`;
                console.log(message);
            }
        });
    } catch (error) {
        console.error('Error checking parking availability:', error.message)
    }

}

async function handleParkingReserveSpot() {
    try {
        const client = new parkingProto.Parking('localhost:50051', grpc.credentials.createInsecure());
        const parkingLotId = await new Promise((resolve) => readline.question('Enter Parking Lot ID: ', resolve));
        const numSpots = await new Promise((resolve) => readline.question('Which spot would you like to reserve: ', resolve));


        const body = {
            parkingLotId: parkingLotId,
            numSpots: parseInt(numSpots)
        };

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




function main() {
    showMainMenu();

    try {
        readline.question('Enter your choice: ', async function (choice) {
            switch (choice) {
                case '1':
                    await handleTrafficLights();
                    break;
                case '2':
                    showParkingSubMenu();
                    readline.question('Enter your choice: ', async function (choice2) {
                        switch (choice2) {
                            case '1':
                                await handleParkingCheckAvailability();
                                break;
                            case '2':
                                await handleParkingReserveSpot();
                                break;
                            default:
                                console.log("Invalid choice");
                        }
                        readline.close();
                    });
                    break;
                case '3':
                    await handlePublicTransport();
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

main();