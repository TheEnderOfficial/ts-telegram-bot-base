import { User } from "@prisma/client";
import { User as TelegramUser } from "telegraf/typings/core/types/typegram";
import { Context } from "../bTypes";
import { prisma } from "../db";

class UserService {
  public static async findUser(ctx: Context, telegramId: number): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        telegramId,
      },
    });
  }

  public static async chargeBalance(user: User, delta: number) {
    return await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        balance: user.balance + delta
      }
    })
  }

  public static async findOrCreateUser(tgUser: TelegramUser): Promise<User> {
    return await prisma.user.upsert({
      where: {
        telegramId: tgUser.id,
      },
      update: {},
      create: {
        telegramId: tgUser.id,
        name: tgUser.first_name,
        username: tgUser.username
      }
    });
  }

  public static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  public static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  public static async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  public static async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  public static async deleteAllUsers(): Promise<void> { 
    await prisma.user.deleteMany();
  }
}

export default UserService;