/**
 * ✅ Interfaz de mascotas perdidas según backend real
 * Basado en la respuesta de GET /api/mascotas-perdidas/listar
 */

export interface LostPet {
  // Identificación
  id: string;
  name: string;
  nombre: string;
  
  // Características físicas
  breed: string;
  raza: string;
  age: string;
  edad: string;
  gender: string;
  sexo: string;
  genero: string;
  color: string;
  size: string;
  tamanio: string;
  especie: string; // "Perro" | "Gato"
  species: string;
  
  // Imagen
  image: string;
  imagen: string;
  
  // Ubicación y pérdida
  location: string;
  perdida_direccion: string;
  lat: number;
  perdida_lat: number;
  lon: number;
  perdida_lon: number;
  lastSeen: string; // ISO date string
  perdida_fecha: string; // ISO date string
  lostDate: string;
  
  // Descripción
  description: string;
  descripcion: string;
  
  // Estados
  perdida: boolean;
  encontrada: boolean;
  
  // Contacto (prioridad: dueño > reportante)
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  
  // Ownership - Para mostrar botones de acción correctamente
  duenio?: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
  };
  owner?: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
  };
  ownerId?: number;
  
  reportado_por?: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
  };
  reportedBy?: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
  };
  reportedById?: number;
  
  // Datos adicionales
  estado_salud?: string;
  healthStatus?: string;
}
