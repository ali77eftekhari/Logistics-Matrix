/// <reference types="vite/client" />

declare module "*.csv?raw" {
  const content: string;
  export default content;
}

declare module "papaparse" {
  export interface ParseConfig<T> {
    header?: boolean;
    skipEmptyLines?: boolean;
  }

  export interface ParseResult<T> {
    data: T[];
  }

  export interface PapaParseStatic {
    parse<T>(input: string, config?: ParseConfig<T>): ParseResult<T>;
  }

  const Papa: PapaParseStatic;
  export default Papa;
}

declare module "react-dom/client" {
  export interface Root {
    render(children: unknown): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}
