import { Request, Response } from 'express';
import helloService from '../services/helloService';

class HelloController {
    public static async hello(req: Request, res: Response) {
        const name = "Express";
        const text = helloService.sayHello(name);

        res.send(text);
    }
}

export default HelloController;