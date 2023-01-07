import helloRouter from "./wRouters/helloRouter";

const globalMiddlewares: any[] = [
    // Add your global middlewares here
];

const routers = [
    // Add your routers here
    helloRouter
];

export {globalMiddlewares, routers};