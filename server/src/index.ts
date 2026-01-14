import app from "./app";
import { env } from "./config/env";

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${env.SERVER_URL}`);
  console.log(`📚 API available at ${env.SERVER_URL}/api/v1`);
  console.log(`🔧 Environment: ${env.NODE_ENV}`);
});
