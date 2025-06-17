import app from "./app";
import { setupTracing } from "./tracing";

setupTracing("ticket-service");

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
