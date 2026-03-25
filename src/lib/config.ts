export const CONFIG = {
  pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY as string,
  unsplashAccessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string,
  workerUrl: import.meta.env.VITE_WORKER_URL as string,
  pixabayBaseUrl: "https://pixabay.com/api/",
  unsplashBaseUrl: "https://api.unsplash.com",
  imagesPerPage: 12,
} as const
