import { defineConfig } from 'astro/config';

const rawSite = process.env.SITE_URL?.trim()
  || process.env.URL?.trim()
  || process.env.CF_PAGES_URL?.trim();

function productionOrigin(value) {
  if (!value) return undefined;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('SITE_URL / URL / CF_PAGES_URL doit être une URL HTTPS valide.');
  }
  const localHost = /^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])$/i.test(parsed.hostname)
    || /\.(localhost|local)$/i.test(parsed.hostname);
  if (parsed.protocol !== 'https:' || localHost || parsed.username || parsed.password
    || parsed.search || parsed.hash || !['', '/'].includes(parsed.pathname)) {
    throw new Error('L’URL du site doit être une origine HTTPS publique, sans identifiants, chemin, paramètres ou fragment.');
  }
  return parsed.origin;
}

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: productionOrigin(rawSite),
  devToolbar: { enabled: false },
});
