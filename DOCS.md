# Russian

## Что значит b, w в начале файлов

Это разделение на типы w - Web, b - Bot, т.е `bMiddlewares` это middlewares для бота а `wMiddlewares` это middlewares для web

## Где взять типы Context, Bot

В файле `src/bTypes.ts`

## Как добавить команду в бота

Необходимо создать набор хандлеров для этого создайте файл в `src/bHandlers` который будет экспортировать функцию (`export default`) с типом `(bot: Bot) => void` и в теле этой функции используйте bot.on, bot.command после добавьте эту функцию в массив `handlers` в `src/bConfig.ts`

## Как добавить сцену в бота (Wizard, BaseScene)

Создайте файл в `src/bScenes` который будет экспортировать сцену типа `Scenes.BaseScene<Context>` или `Scenes.WizardScene<Context>` и добавьте эту сцену в массив scenes в `src/bConfig.ts`

## Как добавить middleware (глобальный) в бота или в web

Создайте файл в `src/bMiddlewares` или `src/wMiddlewares` и экспортируйте функцию типа `(req: Request, res: Response, next: NextFunction) => void` (можно использовать `Promise<void>`) для web и `MiddlewareFn<Context>` (`MiddlewareFn` находится в `telegraf`) для бота и зарегиструйте их в globalMiddlewares в `src/bConfig.ts` или `src/wConfig.ts`

## Как добавить web-api

Создайте `controller` в `src/wControllers`, `router` в `src/wRouters`, и если необходимо `сервис` в `src/services` зарегиструйте `router` в `routers` в `src/wConfig.ts`

## Что такое Service

Service - бизнес логика (пример. userService - CRUD пользователей)