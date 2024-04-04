const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
const { changeSignalTimings } = require('../services/traffic_lights');
const { getNextBus } = require('../services/public_transport');
const { checkAvailability, reserveSpot } = require('../services/parking');


const trafficLightsPackageDefinition = protoloader.loadSync('protos/traffic_lights.proto', {});
const trafficLightsProto = grpc.loadPackageDefinition(trafficLightsPackageDefinition).trafficlights;

const publicTransportPackageDefinition = protoloader.loadSync('protos/public_transport.proto', {});
const publicTransportProto = grpc.loadPackageDefinition(publicTransportPackageDefinition).PublicTransport;

const parkingPackageDefinition = protoloader.loadSync('protos/parking.proto', {});
const parkingProto = grpc.loadPackageDefinition(parkingPackageDefinition).Parking;


const server = new grpc.Server();
const serverAddr = '0.0.0.0:50051';


// Add all services in a single object
const services = {
    ChangeSignalTimings: changeSignalTimings,
    GetNextBus: getNextBus,
    CheckAvailability: checkAvailability,
    ReserveSpot: reserveSpot

};

server.addService(trafficLightsProto.TrafficLights.service, services);
server.addService(publicTransportProto.PublicTransport.service, services);
server.addService(parkingProto.Parking.service, services);

server.bindAsync(serverAddr, grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running at " + serverAddr)
});