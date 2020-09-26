import * as dotenv from "dotenv";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";

export default class App {
    public app: express.Application;
    public port: number;

    /**
     * Enable cors
     */
    private options: cors.CorsOptions = {
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Access-Control-Allow-Origin",
            "Accept",
            "X-Access-Token"
        ],
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: "http://localhost:3000",
        preflightContinue: false
    };

    constructor(controllers: any[], port: number) {
        dotenv.config();

        this.app = express();
        this.port = port;
        this.initMiddleware();
        this.initControllers(controllers);
        this.initRoutes();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private initMiddleware() {
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
        this.app.use(cors(this.options));
        this.app.use(express.static(path.resolve( __dirname, "..","..","frontend", "build")));
    }

    private initControllers(controllers: any[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    private initRoutes() {
        this.app.get("/", (req, res) => res.json({ version: 1 }));
        // Intercept requests to return the frontend's static entry point
        this.app.get("*", (_, response) => {
            response.sendFile(path.resolve("..","..","frontend","build", "index.html"));
        });
    }

}
