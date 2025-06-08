import type { User } from "./types"
import api from "./api"

const AUTH_KEY = "blood_tracker_auth"
const USERS_KEY = "blood_tracker_users"

export async function signIn(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    return user;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function signUp(userData: Omit<User, 'id'>) {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    return user;
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export async function signOut() {
  localStorage.removeItem('auth_token');
  window.location.href = '/signin';
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function updateProfile(userData: Partial<User>) {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  const users = localStorage.getItem(USERS_KEY)
  if (!users) return []

  try {
    return JSON.parse(users)
  } catch {
    return []
  }
}

export function saveUser(user: User) {
  if (typeof window === "undefined") return

  const users = getAllUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email === email) || null
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
