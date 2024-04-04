const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;


function main() {
    const client = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());

    const body = {
        intersectionId: "AnthonysAmazingIntersection",
        signalTimings: [
            { color: "GREEN", durationSeconds: 30 },
            { color: "RED", durationSeconds: 20 },
        ]
    };
    console.log(body)

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
    console.log(body2)

    client2.GetNextBus(body, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Public transport next bus result:', response);
        }
    })
}

main();