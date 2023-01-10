import userRouter from "./users/userRouter";
import webUserRouter from "./webUsers/webUserRouter";

const globalMiddlewares: any[] = [
  // Add your global middlewares here
];

type Router = {
  path: string;
  router: any;
}

const routers: Router[] = [
  // Add your routers here
  {
    path: "/users",
    router: userRouter,
  },
  {
    path: "/webUsers",
    router: webUserRouter,
  }
];

export { globalMiddlewares, routers };
