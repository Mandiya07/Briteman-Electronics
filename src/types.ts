export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  condition: 'New' | 'Pre-Owned';
  availability: 'In Stock' | 'Out of Stock' | 'Low Stock';
  stock: number;
  image: string;
  images: string[];
  specs: Record<string, string>;
  description: string;
  warranty: string;
  sku: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface WholesaleProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  approved?: boolean;
  status?: string;
  tier?: string;
  registryNumber?: string;
  createdAt?: string;
}

export interface WholesaleQuoteRequest {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  items: {
    productName: string;
    quantity: number;
    notes?: string;
  }[];
  uploadedFileList?: string; // name of simulated list uploaded
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected' | 'Approved' | string;
  quotedPrice?: number;
  assignedPrice?: number;
  date?: string;
  createdAt?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Coupon {
  code: string;
  percent: number;
  active: boolean;
  description: string;
}
