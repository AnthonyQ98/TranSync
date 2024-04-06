// Import required modules
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');

// Import service implementations
const { changeSignalTimings } = require('../services/traffic_lights');
const { getNextBus } = require('../services/public_transport');
const { checkAvailability, reserveSpot } = require('../services/parking');

// Load protocol buffers for traffic lights service
const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

// Load protocol buffers for public transport service
const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;

// Load protocol buffers for parking service
const parkingPackageDefinition = protoloader.loadSync('protos/parking.proto', {});
const parkingProto = grpc.loadPackageDefinition(parkingPackageDefinition).Parking;

// Create gRPC server
const server = new grpc.Server();

// Define server address
const serverAddr = '0.0.0.0:50051';

// Create an object containing all service implementations
const services = {
    ChangeSignalTimings: changeSignalTimings,
    GetNextBus: getNextBus,
    CheckAvailability: checkAvailability,
    ReserveSpot: reserveSpot
};

// Add services to the gRPC server
server.addService(trafficLightsProto.TrafficLights.service, services);
server.addService(publicTransportProto.PublicTransport.service, services);
server.addService(parkingProto.Parking.service, services);

// Bind the server to the specified address and start it
server.bindAsync(serverAddr, grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running at " + serverAddr);
});
