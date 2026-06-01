export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  parent: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
