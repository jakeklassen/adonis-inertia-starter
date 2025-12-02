import { defineConfig } from '@adonisjs/ally';
import type { InferSocialProviders } from '@adonisjs/ally/types';

const allyConfig = defineConfig({});

export default allyConfig;

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
