import axios from 'axios';

const API_BASE_URL = 'https://service.webrebel.net/webrebel/website';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    test:"1",
  },
});

// Request interceptor - token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/giris-yap';
    }
    return Promise.reject(error);
  }
);



// Website Info API - Using existing endpoints
export const getWebsiteInfo = async () => {
  try {
    // Get meta, ibans and contracts data
    const [metaResponse, ibansResponse, contractsResponse] = await Promise.all([
      api.get('/meta'),
      api.get('/ibans'),
      api.get('/agreements').catch(() => ({ data: [] })) // Handle 404 error for contracts
    ]);

    // Check if contracts data exists in meta response
    let contractsData = contractsResponse.data || [];

    // Get website info from API response
    const websiteInfos = metaResponse.data;

    return {
      ...websiteInfos,
      bankAccounts: ibansResponse.data || [],
      contracts: contractsData
    };
  } catch (error) {
    console.error('Website info fetch error:', error);
    return {
      websiteInfos: [],
      bankAccounts: [],
      contracts: []
    };
  }
};

// Categories API
export const getCategories = () => api.get('/categories');
export const getCategoryDetail = (slug: string) => api.get(`/category-detail?slug=${slug}`);
export const getCategoryProducts = (slug: string) => api.get(`/category-products?slug=${slug}`);

// Homepage API
export const getHomepageItems = (length = 3) => api.get(`/homepage-items?length=${length}`);

// Product API
export const getProductDetail = (slug: string) => api.get(`/product-detail?slug=${slug}`);

// Contract API
export const getContractDetail = (slug: string) => api.get(`/agreement?slug=${slug}`);

// Auth API
export const register = (userData: any) => api.post('/register', userData);
export const login = (credentials: any) => api.post('/login', credentials);

// Basket API
export const getMyBasket = () => api.get('/my-basket');
export const addToBasket = (productId: string, piece: number) => api.post('/basket-add', { productId, piece });
export const removeFromBasket = (id: string) => api.post('/basket-remove', { id });
export const clearBasket = () => api.get('/my-basket-clear');

// Order API
export const checkout = () => api.get('/checkout');
export const getOrders = () => api.get('/orders');
export const getOrderDetail = (id: string) => api.get(`/order-detail?id=${id}`);

// Message API
export const createMessage = (messageData: { firstName: string; lastName: string; email: string; title: string; text: string; method: string }) => 
  api.post('/create-message', messageData);



export const getMyData = () => api.get('/my-data');

export const updateName = (firstName: string, lastName: string) =>
  api.post('/update', { method: 1, firstName, lastName });

export const updateEmail = (email: string) =>
  api.post('/update', { method: 2, email });
export const updatePassword = (password: string) =>
  api.post('/update', { method: 3, password });
export default api;





