import { User } from "@prisma/client";
import { User as TelegramUser } from "telegraf/typings/core/types/typegram";
import { Context } from "../bot/bTypes";
import { prisma } from "../db";

class UserService {
  public static async find(ctx: Context, telegramId: number): Promise<User | null> {
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

  public static async findOrCreate(tgUser: TelegramUser): Promise<User> {
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

  public static async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  public static async findById(id: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  public static async update(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  public static async delete(id: string): Promise<User> {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  public static async deleteAll(): Promise<void> { 
    await prisma.user.deleteMany();
  }
}

export default UserService;