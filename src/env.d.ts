/// <reference path="../.astro/types.d.ts" />

declare function gtag(...args: any[]): void;

interface Window {
  dataLayer: any[];
  gtag: typeof gtag;
}
