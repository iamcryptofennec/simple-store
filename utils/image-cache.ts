const imageLoadCache = new Map<string, "loaded" | Promise<void>>();

function getCacheKey(src: string, scope?: string): string {
  return scope !== undefined ? `${scope}:${src}` : src;
}

export function getImageLoadPromise(src: string, scope?: string): Promise<void> {
  const key = getCacheKey(src, scope);
  const cached = imageLoadCache.get(key);
  if (cached === "loaded") {
    return Promise.resolve();
  }
  if (cached !== undefined) {
    return cached;
  }
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageLoadCache.set(key, "loaded");
      resolve();
    };
    img.onerror = () => {
      imageLoadCache.delete(key);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
  imageLoadCache.set(key, promise);
  return promise;
}

export function isImageLoaded(src: string, scope?: string): boolean {
  return imageLoadCache.get(getCacheKey(src, scope)) === "loaded";
}
