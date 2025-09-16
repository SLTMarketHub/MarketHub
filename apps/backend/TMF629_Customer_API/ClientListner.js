let receivedEvents = [];

module.exports = (app) => {
    app.post("/client/listener", (req, res) => {
        console.log("🔔 Received Event:");
        console.log(JSON.stringify(req.body, null, 2));

        receivedEvents.push(req.body);
        if (receivedEvents.length > 50) {
            receivedEvents.shift();
        }

        res.status(200).send("✅ Event received by Client Listener");
    });

    app.get("/client/listener", (req, res) => {
        const eventsHtml = receivedEvents
            .map(
                (event, idx) => `
        <div class="event-card">
          <h3>📌 Event #${idx + 1}</h3>
          <p><b>Type:</b> ${event["@type"]}</p>
          <p><b>Event ID:</b> ${event.eventId}</p>
          <p><b>Event Time:</b> ${new Date(event.eventTime).toLocaleString()}</p>
          <details>
            <summary>Show Full Event JSON</summary>
            <pre>${JSON.stringify(event, null, 2)}<br><br></pre>
          </details>
        </div>
      `
            )
            .join("");

        res.send(`
      <html>
        <head>
          <title>Client Listener - Events</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9fafb;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            h2 { color: #2c3e50; margin-bottom: 10px; }
            p { font-size: 14px; }
            .event-card {
              background: #fff;
              border-radius: 10px;
              padding: 15px;
              margin-bottom: 15px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .event-card h3 { margin: 0 0 8px 0; color: #34495e; }
            details summary {
              cursor: pointer;
              margin-top: 8px;
              color: #007bff;
            }
            pre {
              background: #272822;
              color: #f8f8f2;
              padding: 10px;
              border-radius: 6px;
              overflow-x: auto;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <h2>📡 Client Listener - Received Events</h2>
          <p>Total Events Stored: <b>${receivedEvents.length}</b></p>
          ${eventsHtml || "<p>No events received yet.</p>"}
        </body>
      </html>
    `);
    });
};
