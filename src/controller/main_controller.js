const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const packageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(packageDefinition).TrafficLights;


function main() {
    const client = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());

    const request = {
        intersection_id: "AnthonysAmazingIntersection",
        signal_timings: [
            { color: "GREEN", duration_seconds: 30 },
            { color: "RED", duration_seconds: 20 },
        ]
    };

    client.ChangeSignalTimings(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('Change Signal Timing result:', response);
        }
    })
}

main();