import userRouter from "./users/userRouter";

const globalMiddlewares: any[] = [
  // Add your global middlewares here
];

const routers: any[] = [
  // Add your routers here
  userRouter,
];

export { globalMiddlewares, routers };
