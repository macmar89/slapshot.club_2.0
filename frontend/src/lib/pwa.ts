export async function clearPwaCaches() {
  if (typeof window === 'undefined') return;

  navigator.serviceWorker?.controller?.postMessage({ type: 'CLEAR_CACHES' });

  if (!('caches' in window)) return;

  try {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key.startsWith('slapshot-')).map((key) => caches.delete(key)),
    );
  } catch {
    return;
  }
}
