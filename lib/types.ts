export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  createdAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

export interface RegisterResponse extends AuthResponse {}
export interface LoginResponse extends AuthResponse {}
export interface CurrentUserResponse extends AuthResponse {}

export interface ApiErrorResponse {
  error: string;
  details?: string[];
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
}

export interface ProductResponse extends Product {}
export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}
export type UpdateProductRequest = Partial<CreateProductRequest>;
export interface DeleteProductResponse {
  message: string;
}

export interface CartItem {
  product: Product | string | null;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  cart: Cart;
}

export interface AddCartItemRequest {
  productId: string;
  quantity?: number;
}
export interface UpdateCartItemRequest {
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
  order: Order;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  order: Order;
}
