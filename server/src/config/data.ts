export const languageMap: Record<string, string> = {
  cpp: "g++-15",
  python: "python-3.14",
  java: "openjdk-25",
  rust: "rust-1.93",
  go: "go-1.26",

  // closest match available
  typescript: "typescript-deno",

  // not supported by OnlineCompiler
  javascript: "typescript-deno",
  html: "",
  css: "",
  json: "",
};