import express, {
  Express,
  Request,
  Response,
  NextFunction,
  json,
} from "express";
import { PORT } from "./config";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(json());
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes("/api/")) {
        res.status(404).send("Not found !");
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes("/api/")) {
          console.error("Error : ", err.stack);
          res
            .status(500)
            .send(err.stack?.split("\n")[0].replace("Error: ", ""));
        } else {
          next();
        }
      }
    );
  }

  private routes(): void {
    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Welcome to fpistore.net API !`);
    });
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Server running on port : ${PORT}`);
    });
  }
}
