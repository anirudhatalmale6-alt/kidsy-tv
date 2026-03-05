const https = require('https');
const http = require('http');

/**
 * Resolves Castr player URLs to direct stream URLs.
 * Supports:
 * - Direct HLS (.m3u8) URLs - returned as-is
 * - Direct MP4 URLs - returned as-is
 * - Castr player live URLs (player.castr.com/live_xxx)
 * - Castr player VOD URLs (player.castr.com/vod/xxx)
 */
async function resolveStreamUrl(url) {
  if (!url) return url;

  // Already a direct stream URL
  if (url.match(/\.(m3u8|mp4|webm|mkv|avi|mov|ts)(\?|$)/i)) {
    return url;
  }

  // Castr player URL - fetch page and extract __streamUrl
  if (url.includes('player.castr.com')) {
    try {
      const html = await fetchPage(url);
      // Look for window.__streamUrl = "..."
      const match = html.match(/window\.__streamUrl\s*=\s*["']([^"']+)["']/);
      if (match && match[1]) return match[1];
      // Look for src in video/source tags
      const srcMatch = html.match(/src\s*=\s*["']([^"']*\.m3u8[^"']*)["']/);
      if (srcMatch && srcMatch[1]) return srcMatch[1];
      const mp4Match = html.match(/src\s*=\s*["']([^"']*\.mp4[^"']*)["']/);
      if (mp4Match && mp4Match[1]) return mp4Match[1];
    } catch (e) {
      console.error('Failed to resolve Castr URL:', e.message);
    }
  }

  return url;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

module.exports = { resolveStreamUrl };
