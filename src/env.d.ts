/// <reference types="astro/client" />

declare module '*.bib?raw' {
  const contents: string;
  export default contents;
}
