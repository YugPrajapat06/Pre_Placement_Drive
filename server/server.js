import "dotenv/config";
import dns from "node:dns";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectToDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});