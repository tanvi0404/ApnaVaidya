// Vitest JSDOM environment polyfills
if (typeof window !== 'undefined') {
  if (!window.DOMMatrix) {
    window.DOMMatrix = class DOMMatrix {
      constructor() {
        this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      }
    };
  }
  if (!globalThis.DOMMatrix) {
    globalThis.DOMMatrix = window.DOMMatrix;
  }
}
