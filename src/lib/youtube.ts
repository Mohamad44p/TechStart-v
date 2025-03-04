let isLoadingAPI = false;
let isAPILoaded = false;

export function loadYouTubeAPI(): Promise<void> {
  if (isAPILoaded) return Promise.resolve();
  if (isLoadingAPI) {
    return new Promise((resolve, reject) => {
      const checkAPI = setInterval(() => {
        if (window.YT) {
          clearInterval(checkAPI);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkAPI);
        reject(new Error('YouTube API load timeout'));
      }, 10000);
    });
  }

  isLoadingAPI = true;

  return new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    // Success callback
    window.onYouTubeIframeAPIReady = () => {
      isAPILoaded = true;
      isLoadingAPI = false;
      resolve();
    };

    // Error handling
    tag.onerror = () => {
      isLoadingAPI = false;
      reject(new Error('Failed to load YouTube API'));
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
}
