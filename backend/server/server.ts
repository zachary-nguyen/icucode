import App from "./app";
import "dotenv/config"
const port = parseInt(process.env.PORT as string, 10) || 8080;

/**
 * Initialize App with controllers and port
 */
const app = new App([],
    port
);

app.listen();
