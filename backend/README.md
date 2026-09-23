# Backend (Express + PostgreSQL)

REST API для учебного интернет-магазина. Контракты совместимы с ТЗ (`tz_vue_mvp.md`), но роли, остатки и уведомления обрабатываются на сервере.

## Стек

- Express + TypeScript
- PostgreSQL 16
- Prisma ORM
- JWT access + refresh tokens
- Zod-валидация

## Быстрый старт

Нужны Node.js 20+ и Docker.

```bash
cd backend
cp .env.example .env
npm install
npm run db:up
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

API: `http://localhost:3001`  
Health: `GET /health`

Для фронта: `VITE_API_URL=http://localhost:3001`

## Демо-аккаунты

Пароль у обоих: `password123`

| Роль    | Email               |
|---------|---------------------|
| USER    | user@shop.test      |
| MANAGER | manager@shop.test   |

## Основные эндпоинты

### Auth
- `POST /register` — регистрация
- `POST /login` — `{ accessToken, refreshToken, user }`
- `POST /refresh` — обновление токенов `{ refreshToken }`
- `POST /logout` — отзыв refresh-токена
- `GET /users/:id`, `PATCH /users/:id`

Заголовок: `Authorization: Bearer <accessToken>`

### Каталог
- `GET /categories`, `POST /categories` (MANAGER)
- `GET /products` — query как в ТЗ: `q`, `categoryId`, `price_gte`, `price_lte`, `isPublished`, `_sort`, `_order`, `_page`, `_limit` + заголовок `X-Total-Count`
- `GET /products/:id`
- `POST|PATCH|DELETE /products/:id` — только MANAGER

Покупатели видят только `isPublished=true`.

### Корзина (auth)
Остаток на складе при добавлении в корзину не уменьшается — только при `POST /orders`.

- `GET /cart` — `{ items, totalCount, totalAmount }`
- `GET /cart/info` — кратко для шапки: `{ totalCount, uniqueItems }`
- `POST /cart/items` — `{ productId, quantity }` (тот же товар суммируется)
- `PATCH /cart/items/:productId` — `{ quantity }`
- `DELETE /cart/items/:productId`
- `DELETE /cart` — очистить

`totalCount` — сумма количеств, `uniqueItems` — число разных товаров.

### Заказы (auth)
- `GET /orders`, `GET /orders?userId=`
- `POST /orders` — `{ items: [{ productId, quantity }] }` (сервер проверяет stock, уменьшает остаток, пишет snapshot цены/названия, создаёт уведомление)
- `GET /orders/:id`
- `PATCH /orders/:id` — `{ status }` с проверкой переходов; при `CANCELLED` остаток возвращается

### Уведомления (auth)
- `GET /notifications?userId=&_sort=createdAt&_order=desc`
- `POST /notifications`
- `PATCH /notifications/:id` — `{ isRead: true }`

## Отличия от json-server в ТЗ

- Проверка ролей на backend
- Создание заказа и изменение остатков — в одной транзакции
- Уведомления при создании/смене статуса заказа создаёт сервер
- Добавлены `/refresh` и `/logout`

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | API в watch-режиме |
| `npm run db:up` | Поднять Postgres в Docker |
| `npm run db:migrate` | Миграции |
| `npm run db:seed` | Demo-данные |
| `npm run db:studio` | Prisma Studio |
