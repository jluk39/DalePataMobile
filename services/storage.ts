import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = {
  AUTH_TOKEN: 'dalepata-auth-token',
  USER_DATA: 'dalepata-user',
}

/**
 * Storage service for managing persistent data in React Native
 * Uses AsyncStorage instead of localStorage
 */
export class StorageService {
  // Token management
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  }

  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } catch (error) {
      console.error('Error setting token:', error)
      throw error
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Error removing token:', error)
      throw error
    }
  }

  // User data management
  static async getUser(): Promise<any | null> {
    try {
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  static async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    } catch (error) {
      console.error('Error setting user:', error)
      throw error
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Error removing user:', error)
      throw error
    }
  }

  // Clear all app data
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA])
    } catch (error) {
      console.error('Error clearing storage:', error)
      throw error
    }
  }
}
