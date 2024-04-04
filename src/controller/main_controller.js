const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;

const parkingPackageDefinition = protoloader.loadSync('protos/parking.proto', {});
const parkingProto = grpc.loadPackageDefinition(parkingPackageDefinition).Parking;


function main() {
    const client = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());

    const body = {
        intersectionId: "AnthonysAmazingIntersection",
        signalTimings: [
            { color: "GREEN", durationSeconds: 30 },
            { color: "RED", durationSeconds: 20 },
        ]
    };

    client.ChangeSignalTimings(body, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Change Signal Timing result:', response);
        }
    })


    const client2 = new publicTransportProto.PublicTransport('localhost:50051', grpc.credentials.createInsecure());

    const body2 = {
        busStopId: "12"
    };

    client2.GetNextBus(body, function(err, response) {
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

    client3.CheckAvailability(body3_1, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Checking availability of parking at ' + body3_2.parkingLotId + ':', JSON.stringify(response.availableSpots) + ' spots remaining.');
        }
    })

    client3.ReserveSpot(body3_2, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(response.message);
        }
    })

}

main();