"# Heartbeat-Monitor" 
<img width="1195" height="922" alt="image" src="https://github.com/user-attachments/assets/449061b7-1766-4814-a87c-28f13fa82c59" />

# Heartbeat Monitor

A minimal real-time HTTP heartbeat monitor for measuring the actual communication path between a browser client and a Node.js server.

The project is intentionally simple:

The client sends an `alive` request, the server records a timestamp and returns it, and the client measures the round-trip time (RTT).

The purpose is to observe the real communication between a user and the server with the smallest possible server-side operation.

## Concept

    CLIENT                         SERVER
       |                              |
       |------ GET /heartbeat ------->|
       |                              |
       |                       timestamp = Date.now()
       |                              |
       |<----- { timestamp } ---------|
       |                              |
       |        measure RTT            |

The heartbeat server does almost no application processing.

This makes the heartbeat a simple reference point for observing the communication path itself.

## What is measured

The client records:

- FE send time
- BE timestamp
- FE receive time
- latest RTT
- average of the last 20 heartbeats
- average RTT since the beginning
- minimum RTT
- maximum RTT
- timeouts
- heartbeat history

## Dashboard

The monitor displays:

- `ALIVE` status
- latest RTT
- FE send timestamp
- BE timestamp
- FE receive timestamp
- average of the last 20 heartbeats
- average since the beginning
- minimum and maximum RTT
- timeout count

It also displays two graphs:

1. RTT for each heartbeat
2. Average RTT since the beginning

A table shows the individual heartbeat measurements.

## Why a heartbeat?

A normal application request can involve many operations:

    HTTP request
        |
        +-- application logic
        +-- database
        +-- external services
        +-- serialization
        |
    HTTP response

If such a request becomes slow, several different causes can contribute to the delay.

The heartbeat intentionally removes that complexity:

    HTTP request
        |
    timestamp
        |
    HTTP response

The server therefore performs only the minimum operation necessary to confirm that it is alive and responding.

## RTT

The client measures the elapsed time between sending the heartbeat and receiving the response.

The RTT is measured locally by the client using a high-resolution timer, so the measurement does not require the client and server clocks to be synchronized.

The BE timestamp is kept separately as the server's own temporal reference.

## Timeouts

If a heartbeat does not receive a response within the configured timeout window, the monitor records a timeout.

A timeout does not by itself identify the exact cause.

It means that, from the client's point of view, a response was not confirmed within the allowed time.

Possible causes can include communication problems, temporary congestion, server availability problems, or a response that did not reach the client in time.

The important observation is the loss of confirmation.

## Real-time observation

The monitor does not only show the current value.

It maintains a sequence of measurements:

    80 ms
    83 ms
    78 ms
    91 ms
    84 ms
    167 ms
    81 ms
    ...

This makes it possible to observe:

- normal latency
- latency spikes
- sustained degradation
- jitter
- missing responses
- recovery

A single measurement is only a point in time.

The sequence shows the behavior of the communication over time.

## Architecture

The current project intentionally contains only the heartbeat.

    CLIENT
       |
       | HTTP
       v
    /heartbeat
       |
       v
    NODE.JS
       |
    timestamp
       |
       v
    CLIENT
       |
       v
      RTT

The heartbeat is independent of application-specific processing.

## Server

The server listens on the port supplied by the hosting environment:

    const port = process.env.PORT || 3000;

It binds to:

    0.0.0.0

rather than a fixed public IP address.

The heartbeat endpoint returns a JSON object containing the server timestamp:

    {
      "timestamp": 1778940000000
    }

## Running locally

Requirements:

- Node.js
- npm

Install dependencies:

    npm install

Start the server:

    npm start

When running locally, the default port is:

    3000

The application can then be opened at:

    http://localhost:3000

## Deployment

The application is designed to run on hosting environments that provide the listening port through `process.env.PORT`.

The public URL is used by the browser.

The internal Node.js port supplied by the hosting platform does not need to be exposed to the client.

    Browser
       |
       | https://your-domain/
       v
    Hosting platform
       |
       | internal PORT
       v
    Node.js
       |
       +-- /heartbeat

## Design principle

The heartbeat is intentionally small.

Its purpose is not to reproduce normal application processing.

Its purpose is to provide a simple, continuous and measurable signal:

    Is the service responding to me?
    How long does the round trip take?
    When did the server respond?
    Did a response fail to arrive?

The real browser client is therefore the observation point of the communication path.

## Project status

The current version contains the heartbeat monitor only.

The project is designed so that additional server-side processing can be added later without changing the fundamental heartbeat concept.

## License

Add the license you prefer for the project.

