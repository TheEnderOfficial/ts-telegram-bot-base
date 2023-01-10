import { User, WebUser } from "@prisma/client";
import { prisma } from "../db";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { decrypt, encrypt } from "./webUsersUtils";

class WebUserService {
  public static async findAll() {
    return prisma.webUser.findMany({include: { tgUser: true}});
  }
  public static async findById(id: string) {
    return prisma.webUser.findUnique({ where: { id }, include: { tgUser: true }});
  }
  public static async createDeepLinkForLinking(user: WebUser) {
    let id = user.id;
    let message = `link_${id}`;
    let data = encrypt(message, process.env.SECRET || "secret");
    return {
      data
    };
  }
  public static async checkMessage(data_: string): Promise<WebUser | null> {
    let data = decrypt(data_, process.env.SECRET || "secret");

    if (!data.startsWith("link_")) return null;

    let id = data.split("_")[1];

    let user = await this.findById(id);

    return user;
  }
  public static async link(web: WebUser, user: User) {
    return await prisma.webUser.update({
      where: { id: web.id },
      data: {
        tgUser: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
  public static async findByUsername(username: string) {
    return await prisma.webUser.findFirst({
      where: {
        username,
      },
      include: {
        tgUser: true
      }
    });
  }
  public static async unlink(web: WebUser) {
    return await prisma.webUser.update({
      where: { id: web.id },
      data: {
        tgUser: {
          disconnect: true
        }
      },
    });
  }
  public static async unlinkTelegram(user: User) {
    return await prisma.user.update({
      where: {id: user.id},
      data: {
        WebUser: {
          disconnect: true
        }
      }
    })
  }
  public static async register(username: string, password: string) {
    return await prisma.webUser.create({
      data: {
        username,
        password: await hash(password, 10),
      },
    });
  }

  public static async comparePassword(webUser: WebUser, password: string) {
    return compare(password, webUser.password);
  }
  public static async createJWT(webUser: WebUser): Promise<string> {
    let payload = {
      userID: webUser.id,
    };

    return sign(payload, process.env.JWT_SECRET || "SECRET", {
      expiresIn: "1d",
    });
  }
  public static async findUserByJWT(token: string): Promise<WebUser | null> {
    let payload: any = verify(token, process.env.JWT_SECRET || "SECRET");
    return await this.findById(payload.userID);
  }
  public static async changePassword(user: WebUser, newPassword: string) {
    return await prisma.webUser.update({
      where: { id: user.id },
      data: {
        password: await hash(newPassword, 10),
      },
    });
  }
}

export default WebUserService;
