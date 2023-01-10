import { Response, Request } from "express"
import WebUserService from "./webUserService";

class WebUserController {
    public static async login(req: Request, res: Response) {
        let {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Отсутствует логин или пароль"
            })
        }

        let user = await WebUserService.findByUsername(username)

        if (!user) {
            return res.status(404).json({
                error: "Неверный логин"
            })
        }

        let isPassword = await WebUserService.comparePassword(user, password)

        if (!isPassword) {
            return res.status(401).json({
                error: "Неверный пароль"
            })
        }

        let token = await WebUserService.createJWT(user)

        return res.json({
            token,
            user
        });
    }

    public static async register(req: Request, res: Response) {
        let {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Отсутствует логин или пароль"
            })
        }

        let candidate = await WebUserService.findByUsername(username)

        if (candidate) {
            return res.status(400).json({
                error: "Пользователь с таким логином уже существуетт"
            })
        }

        let user = await WebUserService.register(username, password)

        let token = await WebUserService.createJWT(user)

        return res.json({
            user,
            token
        });
    }

    public static async me(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }

    public static async link(req: Request, res: Response) {
        let {user} = req;
        
        if (!user) return res.status(500).json({
            error: "Ошибка сервера"
        })

        let data = await WebUserService.createDeepLinkForLinking(user)
        let me = await req.bot.telegram.getMe();

        let url = `https://t.me/${me.username}?start=${data.data}`;

        return res.status(200).json({
            data,
            url
        })
    }

    public static async unlink(req: Request, res: Response) {
        let {user} = req;
        
        if (!user) return res.status(500).json({
            error: "Ошибка сервера"
        })

        await WebUserService.unlink(user);

        return res.status(200).json({success: true})
    }

    public static async findAll(req: Request, res: Response) {
        return res.status(200).json(await WebUserService.findAll())
    }

    public static async findById(req: Request, res: Response) {
        return res.status(200).json(await WebUserService.findById(req.params.id))
    }

    public static async changePassword(req: Request, res: Response) {
        let {user} = req;
        let {newPassword} = req.body;

        if (!newPassword) {
            return res.status(400).json({
                error: "Отсутствует новый пароль"
            });
        }

        let updatedUser = await WebUserService.changePassword(user, newPassword)

        return res.status(200).json(updatedUser)
    }
}

export default WebUserController