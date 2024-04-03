const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const packageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(packageDefinition).trafficlights;


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
}

main();