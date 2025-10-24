import { ApiService } from '@/services'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  nombre: string
  apellido?: string
  userType?: string
  tipo?: string
  role?: string
  user_type?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<any>
  register: (userData: any) => Promise<any>
  registerByType: (userData: any, userType: string) => Promise<any>
  refreshUserProfile: () => Promise<any>
  refreshAuth: () => void
  checkUserAccess: (allowedTypes?: string[]) => { allowed: boolean; redirectTo?: string }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...')
      
      try {
        const token = await ApiService.getToken()
        const savedUser = await ApiService.getUser()
        
        console.log('📝 Auth check:', { 
          hasToken: !!token, 
          hasUser: !!savedUser,
          tokenLength: token ? token.length : 0,
          userEmail: savedUser ? savedUser.email : 'none'
        })
        
        if (token && savedUser) {
          // Si tenemos token y usuario guardado, usar directamente
          console.log('✅ Using saved authentication:', savedUser.email)
          setUser(savedUser)
          
          // Verificar token en segundo plano (no bloquear la UI)
          ApiService.getUserProfile()
            .then(profile => {
              if (profile.user) {
                console.log('🔄 Profile verification successful, updating user data')
                setUser(profile.user)
                ApiService.setUser(profile.user)
              }
            })
            .catch(error => {
              console.log('⚠️ Background profile verification failed:', error.message)
              // Solo limpiar si es error 401/403 (no autorizado)
              if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Token')) {
                console.log('🚫 Invalid token, clearing auth')
                ApiService.logout()
                setUser(null)
              }
              // Para otros errores (red, servidor), mantener la sesión local
            })
        } else if (token && !savedUser) {
          // Tenemos token pero no usuario guardado, intentar obtener perfil
          try {
            const profile = await ApiService.getUserProfile()
            if (profile.user) {
              console.log('✅ Profile fetched successfully:', profile.user.email)
              setUser(profile.user)
              await ApiService.setUser(profile.user)
            } else {
              console.log('❌ No user in profile response')
              setUser(null)
            }
          } catch (error: any) {
            console.log('❌ Failed to fetch profile:', error.message)
            await ApiService.logout()
            setUser(null)
          }
        } else {
          console.log('📭 No auth data found')
          setUser(null)
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error)
        setUser(null)
      } finally {
        console.log('✅ Auth initialization complete')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signOut = async () => {
    try {
      await ApiService.logout()
      setUser(null)
      console.log('User signed out')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await ApiService.login(email, password)
      
      if (result.token) {
        await ApiService.setToken(result.token)
      }
      
      if (result.user) {
        await ApiService.setUser(result.user)
        setUser(result.user)
      }
      
      return result
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const result = await ApiService.register(userData)
      
      if (result.token) {
        await ApiService.setToken(result.token)
      }
      
      if (result.user) {
        await ApiService.setUser(result.user)
        setUser(result.user)
      }
      
      return result
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    }
  }

  const registerByType = async (userData: any, userType: string) => {
    try {
      const result = await ApiService.registerByType(userData, userType)
      
      if (result.token) {
        await ApiService.setToken(result.token)
      }
      
      if (result.user) {
        await ApiService.setUser(result.user)
        setUser(result.user)
      }
      
      return result
    } catch (error) {
      console.error('Error registering by type:', error)
      throw error
    }
  }

  const refreshUserProfile = async () => {
    try {
      const profile = await ApiService.getUserProfile()
      if (profile.user) {
        await ApiService.setUser(profile.user)
        setUser(profile.user)
      }
      return profile
    } catch (error) {
      console.error('Error refreshing profile:', error)
      throw error
    }
  }

  const refreshAuth = async () => {
    const token = await ApiService.getToken()
    const savedUser = await ApiService.getUser()
    
    if (token && savedUser) {
      console.log('🔄 Refreshing auth state from AsyncStorage')
      setUser(savedUser)
    }
  }

  const checkUserAccess = (allowedTypes: string[] = []) => {
    if (!user) return { allowed: false, redirectTo: '/auth/login' }
    
    // El campo correcto es userType (con U mayúscula)
    const userType = user.userType || user.tipo || user.role || user.user_type || ''
    
    if (allowedTypes.length > 0 && userType && !allowedTypes.includes(userType)) {
      // Si el usuario no está en la lista de tipos permitidos
      if (userType === 'refugio') {
        return { allowed: false, redirectTo: '/admin/refugio' }
      }
      return { allowed: false, redirectTo: '/' }
    }
    
    return { allowed: true }
  }

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    signIn,
    register,
    registerByType,
    refreshUserProfile,
    refreshAuth,
    checkUserAccess,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
