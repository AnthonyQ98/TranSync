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
    console.log("2) Traffic");
    console.log("3) Public Transport");
}


async function handleTrafficLights() {
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
}


function main() {
    showMainMenu();

    readline.question('Enter your choice: ', async function (choice) {
        switch (choice) {
            case '1':
                await handleTrafficLights();
                break;
            case '2':
                await handleTraffic();
                break;
            case '3':
                await handlePublicTransport();
                break;
            default:
                console.log("Invalid choice");
        }
        readline.close();
    });


    const client2 = new publicTransportProto.PublicTransport('localhost:50051', grpc.credentials.createInsecure());
    const body2 = {
        busStopId: "12"
    };
    client2.GetNextBus(body2, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Public transport next bus result:', response);
        }
    })


    const client3 = new parkingProto.Parking('localhost:50051', grpc.credentials.createInsecure());
    const body3_1 = {
        parkingLotId: "NCI_STAFF_PARKING",
    };
    const body3_2 = {
        parkingLotId: "NCI_STAFF_PARKING",
        numSpots: 12
    };
    client3.CheckAvailability(body3_1, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Checking availability of parking at ' + body3_2.parkingLotId + ':', JSON.stringify(response.availableSpots) + ' spots remaining.');
        }
    })
    client3.ReserveSpot(body3_2, function (err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(response.message);
        }
    })

}

main();