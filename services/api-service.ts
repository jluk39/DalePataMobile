import { router } from 'expo-router'
import { API_CONFIG, API_ENDPOINTS, debugLog, handleApiError } from './api-config'
import { StorageService } from './storage'

export interface Pet {
  id: number | string
  name: string
  age: string
  gender: string
  location: string
  shelter: string
  description: string
  image: string
  phone?: string
  shelterId?: number | string
  species: string
  breed: string
  healthStatus: string
  vaccinated?: boolean
  sterilized?: boolean
  urgent?: boolean
  status?: string
  [key: string]: any
}

export interface AdoptionRequest {
  housingType: string
  hasYard: boolean
  landlordPermission?: boolean
  petExperience: string
  currentPets: string
  adoptionReason: string
  timeCommitment: string
}

export class ApiService {
  // Helper method for handling API responses and token expiration
  private static async handleResponse(response: Response) {
    console.log('🔍 handleResponse - Status:', response.status, response.statusText)
    
    if (response.status === 401) {
      console.error('❌ 401 - Token expirado o inválido')
      // Token expired or invalid
      await this.logout()
      // Navigate to login screen
      router.replace('/auth/login' as any)
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }
    
    if (!response.ok) {
      console.error('❌ Response not OK - Status:', response.status)
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error data del servidor:', JSON.stringify(errorData, null, 2))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    const jsonData = await response.json()
    console.log('✅ handleResponse - JSON parseado:', JSON.stringify(jsonData, null, 2))
    return jsonData
  }

  // ========================================
  // PET ENDPOINTS
  // ========================================

  static async fetchPets(): Promise<Pet[]> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LIST_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching pets')
      }
      
      return result.data.map((pet: any) => ({
        id: pet.id,
        name: pet.nombre,
        age: pet.edad || 'Edad no especificada',
        gender: pet.genero,
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : '',
        image: pet.imagen,
        phone: pet.telefono_refugio,
        shelterId: pet.refugio_id,
        species: pet.especie,
        breed: pet.raza,
        healthStatus: pet.estado_salud,
        vaccinated: pet.estado_salud === 'Saludable' || pet.estado_salud?.includes('Vacunado'),
        sterilized: false,
        urgent: false,
        status: pet.estado_salud,
      }))
    } catch (error) {
      console.error('Error fetching pets:', error)
      throw error
    }
  }

  static async fetchMyPets(): Promise<Pet[]> {
    try {
      console.log('🔐 ApiService.fetchMyPets - Obteniendo token...')
      const token = await StorageService.getToken()
      if (!token) {
        console.error('❌ No hay token disponible')
        throw new Error('Usuario no autenticado')
      }
      console.log('✅ Token obtenido')

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.MY_PETS}`
      console.log('🌐 Solicitando mascotas del usuario:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })
      
      console.log('📡 Respuesta recibida - Status:', response.status)
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        console.error('❌ Backend reportó error:', result.message)
        throw new Error(result.message || 'Error fetching my pets')
      }
      
      console.log('✅ Mascotas obtenidas del backend:', result.data.length)
      
      return result.data.map((pet: any) => ({
        id: pet.id,
        name: pet.nombre,
        age: pet.edad || 'Edad no especificada',
        gender: pet.genero,
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : '',
        image: pet.imagen,
        phone: pet.telefono_refugio,
        shelterId: pet.refugio_id,
        species: pet.especie,
        breed: pet.raza,
        healthStatus: pet.estado_salud,
        fecha_nacimiento: pet.fecha_nacimiento,
        color: pet.color,
        peso: pet.peso,
        tamaño: pet.tamaño,
        weight: pet.peso,
        size: pet.tamaño,
        en_adopcion: pet.en_adopcion,
        availableForAdoption: pet.en_adopcion,
        adoptionDate: pet.fecha_adopcion ? new Date(pet.fecha_adopcion).toLocaleDateString('es-ES') : null,
        vaccinated: pet.estado_salud === 'Saludable' || pet.estado_salud?.includes('Vacunado'),
        sterilized: false,
        urgent: false,
        status: pet.estado_salud,
        isOwned: true,
      }))
    } catch (error) {
      console.error('Error fetching my pets:', error)
      throw error
    }
  }

  static async createPet(formData: FormData): Promise<any> {
    try {
      console.log('🔐 ApiService.createPet - Obteniendo token...')
      const token = await StorageService.getToken()
      if (!token) {
        console.error('❌ No hay token disponible')
        throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
      }
      console.log('✅ Token obtenido:', token.substring(0, 20) + '...')

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
      }

      const url = `${API_CONFIG.BASE_URL}/mascotas`
      console.log('🌐 URL de destino:', url)
      console.log('📋 Headers:', JSON.stringify(headers, null, 2))
      console.log('📦 Enviando FormData...')

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })
      
      console.log('📡 Respuesta recibida - Status:', response.status, response.statusText)
      console.log('📡 Response headers:', JSON.stringify(response.headers, null, 2))
      
      const result = await this.handleResponse(response)
      console.log('✅ handleResponse completado:', JSON.stringify(result, null, 2))

      if (!result.success) {
        console.error('❌ Backend reportó error:', result.message)
        throw new Error(result.message || 'Error al registrar mascota')
      }

      console.log('🎉 Mascota creada exitosamente en el backend!')
      return result.data
    } catch (error: any) {
      console.error('❌ ApiService.createPet - Error capturado:', error.message)
      console.error('❌ Stack trace:', error.stack)
      throw error
    }
  }

  static async fetchPetById(petId: number | string): Promise<Pet> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_PET(petId)}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching pet details')
      }
      
      const pet = result.data
      return {
        id: pet.id,
        name: pet.nombre,
        breed: pet.detalles?.raza || 'No especificado',
        age: pet.edad || 'Edad no especificada',
        gender: pet.genero,
        color: 'No especificado',
        size: 'No especificado',
        weight: 'No especificado',
        location: pet.ubicacion,
        rescueDate: pet.updated_at ? new Date(pet.updated_at).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }) : 'No disponible',
        status: pet.detalles?.estado_salud || 'Disponible',
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : '',
        image: pet.imagen,
        personality: [],
        medicalHistory: pet.detalles?.estado_salud ? [pet.detalles.estado_salud] : [],
        requirements: [],
        phone: pet.contacto?.telefono || pet.telefono_refugio,
        email: pet.contacto?.email || pet.email_refugio,
        shelter: pet.refugio,
        species: pet.detalles?.especie || 'No especificado',
        shelterId: pet.contacto?.refugio_id || pet.refugio_id,
        healthStatus: pet.detalles?.estado_salud || 'Disponible',
      }
    } catch (error) {
      console.error('Error fetching pet by ID:', error)
      throw error
    }
  }

  static async getAdminPets(): Promise<any[]> {
    try {
      const token = await StorageService.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.MY_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching admin pets')
      }
      
      return result.data.map((pet: any) => {
        const enAdopcion = pet.en_adopcion !== undefined 
          ? pet.en_adopcion 
          : (pet.availableForAdoption !== undefined ? pet.availableForAdoption : true)
        
        return {
          id: pet.id,
          nombre: pet.nombre,
          especie: pet.especie,
          raza: pet.raza,
          edad_anios: pet.edad_anios || pet.edad,
          fecha_nacimiento: pet.fecha_nacimiento,
          sexo: pet.sexo || pet.genero,
          estado_salud: pet.estado_salud,
          en_adopcion: enAdopcion,
          imagen_url: pet.imagen,
          color: pet.color,
          peso: pet.peso,
          tamaño: pet.tamaño,
          descripcion: pet.descripcion && !pet.descripcion.includes('Estado de salud:') ? pet.descripcion : '',
          created_at: pet.updated_at || pet.created_at,
          refugio_id: pet.refugio_id,
          duenio_usuario_id: pet.duenio_usuario_id,
          name: pet.nombre,
          species: pet.especie,
          breed: pet.raza,
          age: pet.edad || 'Edad no especificada',
          gender: pet.sexo || pet.genero,
          healthStatus: pet.estado_salud,
          availableForAdoption: enAdopcion,
          image: pet.imagen,
          weight: pet.peso,
          size: pet.tamaño,
          description: pet.descripcion && !pet.descripcion.includes('Estado de salud:') ? pet.descripcion : '',
        }
      })
    } catch (error) {
      console.error('Error fetching admin pets:', error)
      throw error
    }
  }

  static async updatePet(petId: number | string, petData: FormData | any): Promise<any> {
    try {
      const token = await StorageService.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
      }
      
      let body: any
      
      if (petData instanceof FormData) {
        body = petData
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(petData)
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PET(petId)}`, {
        method: 'PUT',
        headers,
        body,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error updating pet')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating pet:', error)
      throw error
    }
  }

  static async deletePet(petId: number | string): Promise<any> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.DELETE_PET(petId)}`, {
        method: 'DELETE',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error deleting pet')
      }
      
      return result.data
    } catch (error) {
      console.error('Error deleting pet:', error)
      throw error
    }
  }

  // ========================================
  // AUTHENTICATION ENDPOINTS
  // ========================================

  static async login(email: string, password: string, userType: string | null = null): Promise<any> {
    try {
      debugLog('Sending login data:', { email, userType })
      
      const loginData: any = { email, password }
      
      if (userType) {
        loginData.userType = userType
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al iniciar sesión')
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en el login')
      }

      // Save token and user data
      if (result.token) {
        await StorageService.setToken(result.token)
      }
      
      if (result.user) {
        await StorageService.setUser(result.user)
      }

      debugLog('✅ Login successful, data saved')
      return result
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  static async register(userData: any): Promise<any> {
    try {
      debugLog('Sending registration data:', { ...userData, password: '***hidden***' })
      
      const requiredFields = ['nombre', 'apellido', 'email', 'password']
      const missingFields = requiredFields.filter(field => !userData[field]?.trim())
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        let errorMessage = 'Error en el registro'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('email ya está registrado')) {
            errorMessage = 'Este email ya está registrado. ¿Ya tienes una cuenta?'
          } else if (result.message && result.message.includes('validación')) {
            errorMessage = 'Los datos ingresados no son válidos. Verifica tu información.'
          } else if (result.error) {
            errorMessage = result.error
          } else if (result.message) {
            errorMessage = result.message
          } else {
            errorMessage = 'Datos de registro inválidos'
          }
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en el registro')
      }

      return result
    } catch (error) {
      throw handleApiError(error, 'Registration')
    }
  }

  static async registerByType(userData: any, userType: string): Promise<any> {
    try {
      debugLog(`Sending registration data for ${userType}:`, { ...userData, password: '***hidden***' })
      
      let endpoint = API_ENDPOINTS.REGISTER_USER
      switch (userType) {
        case 'usuario':
          endpoint = API_ENDPOINTS.REGISTER_USER
          break
        case 'refugio':
          endpoint = API_ENDPOINTS.REGISTER_SHELTER
          break
        case 'veterinaria':
          endpoint = API_ENDPOINTS.REGISTER_VET
          break
        case 'medico':
          endpoint = API_ENDPOINTS.REGISTER_DOCTOR
          break
        default:
          throw new Error(`Tipo de usuario no válido: ${userType}`)
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        let errorMessage = 'Error en el registro'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('email ya está registrado')) {
            errorMessage = 'Este email ya está registrado. ¿Ya tienes una cuenta?'
          } else if (result.message && result.message.includes('validación')) {
            errorMessage = 'Los datos ingresados no son válidos. Verifica tu información.'
          } else if (result.error) {
            errorMessage = result.error
          } else if (result.message) {
            errorMessage = result.message
          } else {
            errorMessage = 'Datos de registro inválidos'
          }
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en el registro')
      }

      return result
    } catch (error) {
      throw handleApiError(error, 'Registration')
    }
  }

  static async getUserProfile(): Promise<any> {
    try {
      const token = await StorageService.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          await StorageService.removeToken()
          throw new Error('Token expirado')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener perfil')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  static async refreshToken(): Promise<any> {
    try {
      const token = await StorageService.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al renovar token')
      }

      const result = await response.json()
      if (result.token) {
        await StorageService.setToken(result.token)
      }
      return result
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  static async checkEmailAvailability(email: string): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHECK_EMAIL(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al verificar email')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error checking email availability:', error)
      throw error
    }
  }

  // ========================================
  // TOKEN & USER MANAGEMENT
  // ========================================

  static async getToken(): Promise<string | null> {
    return StorageService.getToken()
  }

  static async setToken(token: string): Promise<void> {
    return StorageService.setToken(token)
  }

  static async removeToken(): Promise<void> {
    return StorageService.removeToken()
  }

  static async getUser(): Promise<any | null> {
    return StorageService.getUser()
  }

  static async setUser(user: any): Promise<void> {
    return StorageService.setUser(user)
  }

  static async removeUser(): Promise<void> {
    return StorageService.removeUser()
  }

  static async logout(): Promise<void> {
    await StorageService.clearAll()
  }

  // ========================================
  // ADOPTION REQUESTS ENDPOINTS
  // ========================================

  static async getAdoptionRequests(params: any = {}): Promise<any> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const queryParams = new URLSearchParams()
      if (params.estado) queryParams.append('estado', params.estado)
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)

      const queryString = queryParams.toString()
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LIST_ADOPTION_REQUESTS}${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching adoption requests')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching adoption requests:', error)
      throw error
    }
  }

  static async getAdoptionRequestById(requestId: number | string): Promise<any> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_ADOPTION_REQUEST(requestId)}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching adoption request')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching adoption request:', error)
      throw error
    }
  }

  static async createAdoptionRequest(petId: number | string, formData: AdoptionRequest): Promise<any> {
    try {
      debugLog('Creating adoption request:', { petId, formData: { ...formData, adoptionReason: '***truncated***' } })
      
      const token = await StorageService.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const requiredFields: Record<string, string> = {
        housingType: 'Tipo de vivienda',
        hasYard: 'Información sobre patio',
        petExperience: 'Experiencia con mascotas',
        currentPets: 'Información sobre mascotas actuales',
        adoptionReason: 'Razón de adopción',
        timeCommitment: 'Tiempo de dedicación',
      }

      const missingFields = Object.keys(requiredFields).filter(
        field => !formData[field as keyof AdoptionRequest] || 
        (typeof formData[field as keyof AdoptionRequest] === 'string' && !(formData[field as keyof AdoptionRequest] as string).trim())
      )
      
      if (missingFields.length > 0) {
        const missingLabels = missingFields.map(field => requiredFields[field])
        throw new Error(`Campos requeridos faltantes: ${missingLabels.join(', ')}`)
      }

      if (formData.adoptionReason.trim().length < 20) {
        throw new Error('La razón de adopción debe tener al menos 20 caracteres')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CREATE_ADOPTION_REQUEST(petId)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          housingType: formData.housingType,
          hasYard: formData.hasYard,
          landlordPermission: formData.landlordPermission || false,
          petExperience: formData.petExperience,
          currentPets: formData.currentPets,
          adoptionReason: formData.adoptionReason.trim(),
          timeCommitment: formData.timeCommitment.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        let errorMessage = 'Error al enviar solicitud de adopción'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('solicitud pendiente')) {
            errorMessage = 'Ya tienes una solicitud pendiente para esta mascota'
          } else if (result.errors && typeof result.errors === 'object') {
            const errorList = Object.values(result.errors).join(', ')
            errorMessage = `Errores de validación: ${errorList}`
          } else if (result.message) {
            errorMessage = result.message
          }
        } else if (response.status === 404) {
          errorMessage = 'Mascota no encontrada o no disponible para adopción'
        } else if (response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
          await this.logout()
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      if (!result.success) {
        throw new Error(result.message || 'Error en la solicitud de adopción')
      }

      debugLog('✅ Solicitud de adopción enviada exitosamente')
      return result
    } catch (error) {
      console.error('🔥 Error al crear solicitud de adopción:', error)
      throw error
    }
  }

  static async updateAdoptionRequestStatus(requestId: number | string, estado: string, comentario: string = ''): Promise<any> {
    try {
      const token = await StorageService.getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_ADOPTION_REQUEST_STATUS(requestId)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ estado, comentario }),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error updating adoption request status')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating adoption request status:', error)
      throw error
    }
  }
}
