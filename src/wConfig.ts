import userRouter from "./wRouters/wUserRouter";

const globalMiddlewares: any[] = [
    // Add your global middlewares here
];

const routers: any[] = [
    // Add your routers here
    userRouter
    
];

export {globalMiddlewares, routers};