/**
 * Bunny Stream utilities for video upload and deletion.
 *
 * Required environment variables:
 *  VITE_BUNNY_STREAM_LIBRARY_ID   — Bunny Stream Library ID
 *  VITE_BUNNY_STREAM_CDN_HOSTNAME — CDN hostname (e.g. vz-xxxx.b-cdn.net)
 *  VITE_BUNNY_STREAM_API_KEY      — Bunny Stream API key
 *
 * NOTE: Exposing the API key client-side is acceptable for prototypes.
 * In production, route uploads through a secure backend.
 */

const LIBRARY_ID = '784080';
const CDN_HOSTNAME = 'vz-d87e5c7b-d1b.b-cdn.net';
const API_KEY = 'b7425393-d6b7-4289-bfd24ca66713-e6b2-4ffb';

const BUNNY_API_BASE = `https://video.bunnycdn.com/library/${LIBRARY_ID}`;

/**
 * Upload a video file to Bunny Stream.
 *
 * @param {File} file - The video file to upload.
 * @param {{ onUploadProgress?: (pct: number) => void, onProcessingProgress?: (pct: number) => void }} options
 * @returns {Promise<{ url: string, provider: string, providerVideoId: string, thumbnailUrl: string | null }>}
 */
export const uploadVideoToBunny = async (file, options = {}) => {
  const { onUploadProgress, onProcessingProgress } = options;

  if (!LIBRARY_ID || !API_KEY) {
    // Fallback to Cloudinary if Bunny is not configured
    console.warn('Bunny Stream credentials missing — falling back to Cloudinary');
    const { uploadToCloudinary } = await import('./cloudinary.js');
    const url = await uploadToCloudinary(file, 'video');
    return { url, provider: 'cloudinary', providerVideoId: null, thumbnailUrl: null };
  }

  // Step 1: Create a video placeholder in Bunny
  const createRes = await fetch(`${BUNNY_API_BASE}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: file.name }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Bunny: Failed to create video slot — ${err}`);
  }

  const { guid } = await createRes.json();

  // Step 2: Upload the raw file using XHR for progress tracking
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${BUNNY_API_BASE}/videos/${guid}`, true);
    xhr.setRequestHeader('AccessKey', API_KEY);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');

    if (xhr.upload && onUploadProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onUploadProgress) onUploadProgress(100);
        resolve();
      } else {
        reject(new Error(`Bunny upload failed: HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Bunny upload network error'));
    xhr.send(file);
  });

  // Step 3: Poll for encoding completion
  if (onProcessingProgress) {
    let attempts = 0;
    const maxAttempts = 60; // max ~5 minutes
    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 5000));
      const statusRes = await fetch(`${BUNNY_API_BASE}/videos/${guid}`, {
        headers: { 'AccessKey': API_KEY },
      });
      if (statusRes.ok) {
        const info = await statusRes.json();
        // status: 0=queued, 1=processing, 2=encoding, 3=finished, 4=resolution, 5=failed, 6=PresignedUploadStarted
        const pct = info.status === 3 ? 100 : Math.min(90, (attempts / maxAttempts) * 100);
        onProcessingProgress(Math.round(pct));
        if (info.status === 3) break;
        if (info.status === 5) throw new Error('Bunny: Video encoding failed');
      }
      attempts++;
    }
  }

  const cdnHost = CDN_HOSTNAME || `${LIBRARY_ID}.b-cdn.net`;
  const videoUrl = `https://${cdnHost}/${guid}/play.mp4`;
  const thumbnailUrl = `https://${cdnHost}/${guid}/thumbnail.jpg`;

  return {
    url: videoUrl,
    provider: 'bunny',
    providerVideoId: guid,
    thumbnailUrl,
  };
};

/**
 * Delete a video from Bunny Stream by its GUID.
 *
 * @param {string} guid - The Bunny video GUID to delete.
 * @returns {Promise<void>}
 */
export const deleteBunnyVideo = async (guid) => {
  if (!guid || !LIBRARY_ID || !API_KEY) return;

  try {
    await fetch(`${BUNNY_API_BASE}/videos/${guid}`, {
      method: 'DELETE',
      headers: { 'AccessKey': API_KEY },
    });
  } catch (err) {
    console.warn(`Failed to delete Bunny video ${guid}:`, err);
  }
};
