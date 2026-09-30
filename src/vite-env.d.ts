/// <reference types="vite/client" />

interface GcseElementApi {
  render: (options: { div: HTMLElement; tag: 'search' }) => void;
}

interface Window {
  google?: {
    search?: {
      cse?: {
        element?: GcseElementApi;
      };
    };
  };
}
