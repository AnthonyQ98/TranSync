const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const packageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(packageDefinition).TrafficLights;

function changeSignalRequest(call, callback) {
    const result = call.request.number1 + call.request.number2;
    callback(null, {result});
}

function changeSignalTimings(call, callback) {
    const request = call.request;
    
    console.log('Received request:', request);

    const response = {
        message: "Signal timings changed successfully"
    };
    callback(null, response);
}


const server = new grpc.Server();
const serverAddr = '0.0.0.0:50051';


// Add all services in a single object
const services = {
    ChangeSignalRequest: changeSignalRequest,
    ChangeSignalTimings: changeSignalTimings
};
server.addService(trafficLightsProto.TrafficLights.service, services);

server.bindAsync(serverAddr, grpc.ServerCredentials.createInsecure(), () => {
    server.start()
    console.log("Server running at " + serverAddr)
});