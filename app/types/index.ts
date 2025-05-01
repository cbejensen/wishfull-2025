export * from './database.types';

export type User = {
  id: string;
  display_name: string;
  email: string;
  avatar?: string;
  friends: string[]; // Array of user IDs
};

export type PriorityLevel = 1 | 2 | 3;

export enum WishPrivacy {
  FRIENDS = 'friends',
  LINK = 'link',
  PRIVATE = 'private',
}

export enum WishStatus {
  OPEN = 'open',
  PURCHASED = 'purchased',
  FULFILLED = 'fulfilled',
}

export type Wish = {
  id: string;
  userId: string;
  name: string;
  price: number;
  priorityLevel: PriorityLevel;
  links: string[];
  imageUrl?: string;
  description?: string;
  quantity: number | 'infinity';
  privacyLevel: WishPrivacy;
  status: WishStatus;
  tagIds: string[];
  purchasedBy?: string;
  purchaseDate?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type Tag = {
  id: string;
  userId: string;
  name: string;
  color: string;
};

export type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (display_name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export type WishlistContextType = {
  wishes: Wish[];
  tags: Tag[];
  addWish: (wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWish: (wishId: string, updates: Partial<Wish>) => void;
  deleteWish: (wishId: string) => void;
  markAsPurchased: (wishId: string, purchasedBy: string, purchaseDate: string) => void;
  markAsReceived: (wishId: string, received: boolean) => void;
  addTag: (name: string, color: string) => void;
  updateTag: (tagId: string, updates: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;
  loading: boolean;
};