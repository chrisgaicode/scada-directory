import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://scadadirectory.com', // <--- YOU MUST ADD THIS LINE
  integrations: [tailwind(), sitemap()],
});