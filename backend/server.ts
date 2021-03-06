import App from "./app";
import "dotenv/config"
import AuthenticationController from "./controllers/authentication";
import UserController from "./controllers/users";
import CourseController from "./controllers/courses";
import AssignmentController from "./controllers/assignments";
import FileUploadController from "./controllers/file-upload";
const port = parseInt(process.env.PORT as string, 10) || 8080;

/**
 * Initialize App with controllers and port
 */
const app = new App([new AuthenticationController(), new UserController(), new CourseController(), new AssignmentController(), new FileUploadController()],
    port
);

app.listen();
