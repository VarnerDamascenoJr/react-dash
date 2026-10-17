export interface UserRow {
  id: number;
  username: string;
  img: string;
  email: string;
  status: 'active' | 'passive' | 'pending';
  age: number;
}
