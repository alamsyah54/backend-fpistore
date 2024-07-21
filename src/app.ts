import express, {
  Express,
  Request,
  Response,
  NextFunction,
  json,
  urlencoded,
} from "express";
import { PORT } from "./config";
import { AuthRouter } from "./routers/auth.router";
import { UserRouter } from "./routers/user.router";
import { ProductRouter } from "./routers/product.router";
import cors from "cors";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
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
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const productRouter = new ProductRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Welcome to fpistore.net API !`);
    });

    this.app.use("/api/auth", authRouter.getRouter());
    this.app.use("/api/user", userRouter.getRouter());
    this.app.use("/api/product", productRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`Server running on port : ${PORT}`);
    });
  }
}
