const AppLayout = () => import('@/widgets/layout/AppLayout.vue')
const ProductsPage = () => import('@/pages/products/ui/ProductsPage.vue')
const ProductDetails = () => import('@/pages/products/ui/ProductDetails.vue')
const CartPage = () => import('@/pages/cart/ui/CartPage.vue')
const HomePage = () => import('@/pages/home/ui/HomePage.vue')
const AuthLayout = () => import('@/widgets/layout/AuthLayout.vue')
const LoginPage = () => import('@/pages/login/ui/LoginPage.vue')
const NotFound = () => import('@/pages/not-found/ui/NotFound.vue')
const RegisterPage = () => import('@/pages/register/ui/RegisterPage.vue')

export const routes = [
  {
    path: '/',
    name: 'shop',
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
      },
      {
        path: '/products',
        name: 'products',
        component: ProductsPage,
      },
      {
        path: '/product/:id',
        name: 'products_detail',
        component: ProductDetails,
      },
      {
        path: '/cart',
        name: 'cart',
        component: CartPage,
      },
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterPage,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'not-found',
  },
]
