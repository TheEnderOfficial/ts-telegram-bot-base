import userRouter from "./users/wUserRouter";

const globalMiddlewares: any[] = [
    // Add your global middlewares here
];

const routers: any[] = [
    // Add your routers here
    userRouter
    
];

export {globalMiddlewares, routers};