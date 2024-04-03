const grpc = require('@grpc/grpc-js');
const { trafficLightsClient } = require('../servers/traffic_lights_server');

const server = new grpc.Server();
const serverAddr = '0.0.0.0:50051';

TrafficLight
// Add all services in a single object

server.addService(trafficLightsClient);

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