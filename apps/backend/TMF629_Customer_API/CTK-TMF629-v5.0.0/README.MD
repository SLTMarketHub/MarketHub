# Welcome to TMF Conformance Test Kit for V5.0.0 APIs

## Open API Conformance overview

Open API conformance certification for Vendors and Service Providers verifies the successful implementation of Open APIs in commercial products and real-world deployments; it also demonstrates their commitment to industry standards.

## How to Use the Conformance Test Kit (CTK)

- Do not change anything under **DO_NOT_CHANGE** folder
- Read the Conformance Profile for the API of your choice; this profile is stored in the conformance folder, it describes the features for the corresponding API that will be tested from the API implementation, and the expected behavior for those features.
- Change the CHANGE_ME.json file:
  - url: what is the base URL of your API?, e.g., for the Trouble Ticket API, you can do a GET operation on Trouble Ticket at: http://apis.example.com/tmf-api/troubleTicket/v5/TroubleTicket, the value of the url will be: http://apis.example.com/tmf-api/troubleTicket/v5/
  - headers: Headers will accept Key value pairs which will be injected in the headers of the request to the API.
  - payloads: this section allows for the modification of payloads for each operation that has a body for each resource.
- Start the CTK by running the script named after your operational system.

- Send the files “SEND_ME.html” and “SEND_ME.json” to your TM Forum contact to proceed with the certification process.