import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class GatewayService {
  private authService: AxiosInstance;
  private orderService: AxiosInstance;
  private inventoryService: AxiosInstance;
  private productService: AxiosInstance;

  constructor() {
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:23001';
    const orderUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:23002';
    const inventoryUrl = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:23003';
    const productUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:23004';

    this.authService = axios.create({ baseURL: authUrl });
    this.orderService = axios.create({ baseURL: orderUrl });
    this.inventoryService = axios.create({ baseURL: inventoryUrl });
    this.productService = axios.create({ baseURL: productUrl });
  }

  async login(username: string, password: string) {
    const response = await this.authService.post('/api/auth/login', { username, password });
    return response.data;
  }

  async getMe(token: string) {
    const response = await this.authService.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async createOrder(data: { userId: string; productId: string; quantity: number }) {
    const response = await this.orderService.post('/api/orders', data);
    return response.data;
  }

  async getOrders(userId?: string) {
    const params = userId ? { params: { userId } } : {};
    const response = await this.orderService.get('/api/orders', params);
    return response.data;
  }

  async getOrder(id: string) {
    const response = await this.orderService.get(`/api/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await this.orderService.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  }

  async getInventory(productId: string) {
    const response = await this.inventoryService.get(`/api/inventory/${productId}`);
    return response.data;
  }

  async checkInventory(productId: string, quantity: number) {
    const response = await this.inventoryService.post('/api/inventory/check', { productId, quantity });
    return response.data;
  }

  async getProducts() {
    const response = await this.productService.get('/api/products');
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.productService.get(`/api/products/${id}`);
    return response.data;
  }
}