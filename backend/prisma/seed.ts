import bcrypt from "bcryptjs";
import { PrismaClient, OrderStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;
const DEMO_PASSWORD = "password123";

async function main() {
  await prisma.notification.deleteMany();
  await prisma.order.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);

  const manager = await prisma.user.create({
    data: {
      email: "manager@shop.test",
      passwordHash,
      firstName: "Анна",
      lastName: "Менеджерова",
      phone: "+79001112233",
      role: Role.MANAGER,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@shop.test",
      passwordHash,
      firstName: "Иван",
      lastName: "Покупателев",
      phone: "+79005556677",
      role: Role.USER,
    },
  });

  const categories = await Promise.all(
    [
      { name: "Клавиатуры", slug: "keyboards" },
      { name: "Мыши", slug: "mice" },
      { name: "Наушники", slug: "headphones" },
      { name: "Мониторы", slug: "monitors" },
      { name: "Аксессуары", slug: "accessories" },
    ].map((category) => prisma.category.create({ data: category })),
  );

  const [keyboards, mice, headphones, monitors, accessories] = categories;

  const productsData = [
    {
      title: "Механическая клавиатура KeyPro X",
      description: "Переключатели Brown, RGB-подсветка, алюминиевый корпус.",
      categoryId: keyboards.id,
      price: 8990,
      stock: 25,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/keyboard1/600/400",
    },
    {
      title: "Клавиатура Compact 65%",
      description: "Компактная раскладка, hot-swap, бесшумные свитчи.",
      categoryId: keyboards.id,
      price: 6490,
      stock: 40,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/keyboard2/600/400",
    },
    {
      title: "Офисная клавиатура SoftType",
      description: "Мембранная клавиатура для повседневной работы.",
      categoryId: keyboards.id,
      price: 2490,
      stock: 60,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/keyboard3/600/400",
    },
    {
      title: "Игровая клавиатура Arena TKL",
      description: "TKL-формат, свитчи Red, макросы.",
      categoryId: keyboards.id,
      price: 7990,
      stock: 18,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/keyboard4/600/400",
    },
    {
      title: "Мышь ErgoTrack",
      description: "Эргономичная беспроводная мышь для офиса.",
      categoryId: mice.id,
      price: 3290,
      stock: 50,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mouse1/600/400",
    },
    {
      title: "Игровая мышь Strike 8K",
      description: "Сенсор 26K DPI, вес 58 г, 8 кГц polling.",
      categoryId: mice.id,
      price: 5990,
      stock: 30,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mouse2/600/400",
    },
    {
      title: "Мышь Silent Click",
      description: "Тихие кнопки, аккумулятор до 30 дней.",
      categoryId: mice.id,
      price: 2790,
      stock: 45,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mouse3/600/400",
    },
    {
      title: "Мышь Vertical Pro",
      description: "Вертикальная форма снижает нагрузку на запястье.",
      categoryId: mice.id,
      price: 4490,
      stock: 22,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mouse4/600/400",
    },
    {
      title: "Наушники Studio ANC",
      description: "Активное шумоподавление, Bluetooth 5.3.",
      categoryId: headphones.id,
      price: 12990,
      stock: 20,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/head1/600/400",
    },
    {
      title: "Гарнитура GameChat",
      description: "7.1 виртуальный звук, съёмный микрофон.",
      categoryId: headphones.id,
      price: 4990,
      stock: 35,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/head2/600/400",
    },
    {
      title: "Наушники Pocket Buds",
      description: "Компактные TWS с кейсом на 24 часа.",
      categoryId: headphones.id,
      price: 3990,
      stock: 70,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/head3/600/400",
    },
    {
      title: "Наушники OpenEar Sport",
      description: "Открытый дизайн для спорта и улицы.",
      categoryId: headphones.id,
      price: 6990,
      stock: 28,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/head4/600/400",
    },
    {
      title: "Монитор Vision 27 2K",
      description: "27\", IPS, 165 Гц, DisplayHDR 400.",
      categoryId: monitors.id,
      price: 24990,
      stock: 12,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mon1/600/400",
    },
    {
      title: "Монитор Work 24 FHD",
      description: "24\", IPS, 75 Гц, тонкие рамки.",
      categoryId: monitors.id,
      price: 11990,
      stock: 20,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mon2/600/400",
    },
    {
      title: "Монитор UltraWide 34",
      description: "34\", 1440p, 100 Гц, USB-C 65W.",
      categoryId: monitors.id,
      price: 39990,
      stock: 8,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mon3/600/400",
    },
    {
      title: "Монитор Mini LED 32",
      description: "32\", 4K, Mini LED, 144 Гц.",
      categoryId: monitors.id,
      price: 54990,
      stock: 5,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/mon4/600/400",
    },
    {
      title: "USB-хаб 7-в-1",
      description: "HDMI, USB-C PD, кардридер, 3× USB-A.",
      categoryId: accessories.id,
      price: 3490,
      stock: 80,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/acc1/600/400",
    },
    {
      title: "Подставка для ноутбука",
      description: "Алюминий, регулируемый угол наклона.",
      categoryId: accessories.id,
      price: 2190,
      stock: 55,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/acc2/600/400",
    },
    {
      title: "Коврик Desk Mat XL",
      description: "900×400 мм, нескользящая основа.",
      categoryId: accessories.id,
      price: 1490,
      stock: 90,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/acc3/600/400",
    },
    {
      title: "Кабель USB-C 100W",
      description: "2 м, e-marker, нейлоновая оплётка.",
      categoryId: accessories.id,
      price: 990,
      stock: 120,
      isPublished: true,
      imageUrl: "https://picsum.photos/seed/acc4/600/400",
    },
    {
      title: "Клавиатура Draft (скрыта)",
      description: "Черновик товара, не виден покупателям.",
      categoryId: keyboards.id,
      price: 9990,
      stock: 3,
      isPublished: false,
      imageUrl: "https://picsum.photos/seed/draft1/600/400",
    },
    {
      title: "Мышь Prototype (скрыта)",
      description: "Неопубликованный прототип.",
      categoryId: mice.id,
      price: 1990,
      stock: 0,
      isPublished: false,
      imageUrl: "https://picsum.photos/seed/draft2/600/400",
    },
  ];

  const products = [];
  for (const product of productsData) {
    products.push(await prisma.product.create({ data: product }));
  }

  const keyboard = products[0];
  const mouse = products[4];

  const orderItems = [
    {
      productId: keyboard.id,
      title: keyboard.title,
      price: keyboard.price,
      quantity: 1,
    },
    {
      productId: mouse.id,
      title: mouse.title,
      price: mouse.price,
      quantity: 2,
    },
  ];

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PAID,
      items: orderItems,
      totalAmount,
    },
  });

  await prisma.product.update({
    where: { id: keyboard.id },
    data: { stock: { decrement: 1 } },
  });
  await prisma.product.update({
    where: { id: mouse.id },
    data: { stock: { decrement: 2 } },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        text: `Заказ #${order.id} создан`,
        isRead: true,
      },
      {
        userId: user.id,
        text: `Статус заказа #${order.id} изменён на PAID`,
        isRead: false,
      },
      {
        userId: manager.id,
        text: "Добро пожаловать в панель менеджера",
        isRead: false,
      },
    ],
  });

  console.log("Seed completed");
  console.log("Demo accounts (password: password123):");
  console.log(`  MANAGER: ${manager.email}`);
  console.log(`  USER:    ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
