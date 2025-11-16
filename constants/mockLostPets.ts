/**
 * Datos Mock para la sección de Perdidos
 * ⚠️ TEMPORAL: Estos datos serán reemplazados por la API cuando esté lista
 */

export interface LostPet {
  id: number;
  name: string;
  type: 'Perro' | 'Gato';
  breed: string;
  age?: string;
  gender: 'Macho' | 'Hembra';
  color: string;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  image: string;
  status: 'lost' | 'found';
  location: string;
  lastSeen: string; // ISO date string
  description: string;
  urgent: boolean;
  reward: boolean;
  contactPhone: string;
  contactEmail: string;
  lat: number;
  lon: number;
}

export const MOCK_LOST_PETS: LostPet[] = [
  {
    id: 1,
    name: 'Max',
    type: 'Perro',
    breed: 'Labrador',
    age: '3 años',
    gender: 'Macho',
    color: 'Dorado',
    size: 'Grande',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    status: 'lost',
    location: 'Parque Centenario, Caballito, CABA',
    lastSeen: '2025-11-10T10:00:00Z',
    description: 'Perro muy amigable, llevaba collar azul. Se asustó con fuegos artificiales y salió corriendo.',
    urgent: true,
    reward: true,
    contactPhone: '+54 11 1234-5678',
    contactEmail: 'dueno@example.com',
    lat: -34.6097,
    lon: -58.4370,
  },
  {
    id: 2,
    name: 'Luna',
    type: 'Gato',
    breed: 'Siamés',
    age: '2 años',
    gender: 'Hembra',
    color: 'Blanco y gris',
    size: 'Pequeño',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    status: 'found',
    location: 'Plaza Serrano, Palermo, CABA',
    lastSeen: '2025-11-14T15:30:00Z',
    description: 'Gata encontrada cerca de la plaza, muy asustada. Parece estar bien alimentada.',
    urgent: false,
    reward: false,
    contactPhone: '+54 11 8765-4321',
    contactEmail: 'encontre@example.com',
    lat: -34.5891,
    lon: -58.4373,
  },
  {
    id: 3,
    name: 'Rocky',
    type: 'Perro',
    breed: 'Mestizo',
    age: '5 años',
    gender: 'Macho',
    color: 'Negro con manchas blancas',
    size: 'Mediano',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    status: 'lost',
    location: 'Av. Corrientes y Callao, CABA',
    lastSeen: '2025-11-12T18:00:00Z',
    description: 'Perdido durante paseo, llevaba correa roja. Muy cariñoso con las personas.',
    urgent: false,
    reward: false,
    contactPhone: '+54 11 5555-6666',
    contactEmail: 'rocky@example.com',
    lat: -34.6041,
    lon: -58.3924,
  },
  {
    id: 4,
    name: 'Bella',
    type: 'Perro',
    breed: 'Golden Retriever',
    age: '4 años',
    gender: 'Hembra',
    color: 'Dorado claro',
    size: 'Grande',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
    status: 'lost',
    location: 'Bosques de Palermo, CABA',
    lastSeen: '2025-11-13T09:00:00Z',
    description: 'Perdida en los bosques durante el paseo matutino. Tiene chip identificador.',
    urgent: true,
    reward: true,
    contactPhone: '+54 11 2222-3333',
    contactEmail: 'bella@example.com',
    lat: -34.5755,
    lon: -58.4115,
  },
  {
    id: 5,
    name: 'Michi',
    type: 'Gato',
    breed: 'Persa',
    age: '1 año',
    gender: 'Macho',
    color: 'Gris',
    size: 'Pequeño',
    image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400',
    status: 'found',
    location: 'Villa Crespo, CABA',
    lastSeen: '2025-11-14T20:00:00Z',
    description: 'Gato encontrado en jardín. Parece estar perdido, mauillando mucho.',
    urgent: false,
    reward: false,
    contactPhone: '+54 11 9999-8888',
    contactEmail: 'michi@example.com',
    lat: -34.5992,
    lon: -58.4377,
  },
  {
    id: 6,
    name: 'Toby',
    type: 'Perro',
    breed: 'Beagle',
    age: '6 años',
    gender: 'Macho',
    color: 'Tricolor (blanco, marrón y negro)',
    size: 'Mediano',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400',
    status: 'lost',
    location: 'Recoleta, CABA',
    lastSeen: '2025-11-11T16:00:00Z',
    description: 'Se escapó del auto al abrirla puerta. Tiene placa con nombre y teléfono.',
    urgent: false,
    reward: true,
    contactPhone: '+54 11 4444-5555',
    contactEmail: 'toby@example.com',
    lat: -34.5875,
    lon: -58.3974,
  },
];

/**
 * Simula una llamada a la API para obtener mascotas perdidas
 * @returns Promise con array de mascotas perdidas
 */
export const fetchMockLostPets = (): Promise<LostPet[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LOST_PETS);
    }, 1000); // Simula latencia de red
  });
};

/**
 * Simula el envío de un reporte de mascota encontrada
 */
export const submitMockFoundReport = (data: any): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('📝 [MOCK] Reporte enviado:', data);
      resolve({
        success: true,
        message: 'Reporte enviado exitosamente',
      });
    }, 2000);
  });
};

/**
 * Simula el reporte de una mascota propia como perdida
 */
export const reportMockPetAsLost = (petId: number, data: any): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📝 [MOCK] Mascota ${petId} reportada como perdida:`, data);
      resolve({
        success: true,
        message: 'Mascota reportada como perdida exitosamente',
      });
    }, 2000);
  });
};
