const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const { changeSignalTimings } = require('./traffic_lights_server');
const { getNextBus } = require('./public_transport_server');


const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;


const server = new grpc.Server();
const serverAddr = '0.0.0.0:50051';


// Add all services in a single object
const services = {
    ChangeSignalTimings: changeSignalTimings,
    GetNextBus: getNextBus
};
server.addService(trafficLightsProto.TrafficLights.service, services);
server.addService(publicTransportProto.PublicTransport.service, services);

server.bindAsync(serverAddr, grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running at " + serverAddr)
});