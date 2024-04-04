# TranSync

Smart Traffic Lights Service: Implemented as a gRPC server, this service controls traffic lights at intersections. It exposes a ChangeSignalTimings method to adjust signal timings based on traffic conditions.

Parking Service: Also implemented as a gRPC server, this service manages parking spots in parking lots. It provides methods such as CheckAvailability to check the availability of parking spots and ReserveSpot to reserve parking spots.

Public Transport Service: Also implemented as a gRPC server, this service manages public transport arrival times for buses at a given stop. It provides a method GetNextBus to check when the next bus is due for a given stop.

Main Controller: This is a client application responsible for discovering and interacting with the Traffic Lights and Parking services. It utilizes gRPC clients to make requests to these services based on traffic and parking demands.

The main controller acts as a client to interact with the various services and the server on behalf of a client.

TransSync enables efficient transportation management through real-time coordination of traffic lights and parking allocation, demonstrating the capabilities of a smart automated environment within urban settings.
