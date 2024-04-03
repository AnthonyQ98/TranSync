const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinitionTraffic = protoLoader.loadSync('protos/traffic_lights.proto');
const trafficLightsProto = grpc.loadPackageDefinition(packageDefinitionTraffic).TrafficLights;

const trafficLightsClient = new trafficLightsProto.TrafficLights('localhost:50051', grpc.credentials.createInsecure());

const request = {
    intersection_id: "AnthonysAmazingIntersection",
    signal_timings: [
        { color: "GREEN", duration_seconds: 30 },
        { color: "RED", duration_seconds: 20 },
    ]
};

trafficLightsClient.changeSignalTimings({ request }, (err, response) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Response:', response);
    }
});
