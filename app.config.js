export default {
  expo: {
    name: "DalePata",
    slug: "DalePataMobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "dalepata",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dalepata.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Esta aplicación necesita acceder a tu ubicación para mostrar mascotas perdidas cercanas en el mapa.",
        NSLocationAlwaysUsageDescription: "Esta aplicación necesita acceder a tu ubicación para mostrar mascotas perdidas cercanas en el mapa.",
        NSCameraUsageDescription: "Esta aplicación necesita acceso a la cámara para tomar fotos de mascotas.",
        NSPhotoLibraryUsageDescription: "Esta aplicación necesita acceso a tus fotos para subir imágenes de mascotas."
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#89c7a8",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.dalepata.app",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES"
      ]
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#89c7a8",
          dark: {
            backgroundColor: "#89c7a8"
          }
        }
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsImpl: "mapbox"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Esta aplicación necesita acceso a tus fotos para subir imágenes de mascotas.",
          cameraPermission: "Esta aplicación necesita acceso a la cámara para tomar fotos de mascotas."
        }
      ],
      "expo-dev-client",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "dc1c6a13-3d4c-4b28-b560-6c55c85662a3"
      },
      // Variables de entorno embebidas en el build
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.dalepata.com/api",
      mapboxToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1Ijoiamx1azM5IiwiYSI6ImNtaG80dTFwYjA3bzIya3EzMTgyNHY1M3oifQ.Wl24Ug4fRQiK5yblohFVcg",
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://ardusobgkwlhiapfnwkp.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZHVzb2Jna3dsaGlhcGZud2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTU2MDMsImV4cCI6MjA3MTM5MTYwM30._ZwqXh6Ey6sip0HX5YytkNvYbkWyipqTllM6AVHzv4M"
    }
  }
};
