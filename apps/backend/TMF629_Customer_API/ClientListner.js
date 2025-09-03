const express = require("express");
const app = express();
app.use(express.json());

app.post("/client/listener", (req, res) => {
    console.log("Received event:", req.body);
    res.status(200).send("Event received");
});

app.listen(4001, () => {
    console.log("Client listener running on port 4001");
});
