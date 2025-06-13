export class StorageService {
  static setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  static clearToken(): void {
    localStorage.removeItem('auth_token')
  }
} 