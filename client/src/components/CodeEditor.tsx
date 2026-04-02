import ShareButton from "@/components/ShareButton";
import { useRoom } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
// import { useRoom } from "../../liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import type { Awareness as YProtocolAwareness } from "y-protocols/awareness";
import {
  addListener,
  joinRoom,
  removeListener,
  sendLanguageChanged,
  WS_EVENTS,
} from "@/utils/websocket";

const LANGUAGES = [
  { id: "cpp", label: "C++", file: "main.cpp" },
  { id: "javascript", label: "JavaScript", file: "index.js" },
  { id: "typescript", label: "TypeScript", file: "index.ts" },
  { id: "python", label: "Python", file: "main.py" },
  { id: "java", label: "Java", file: "Main.java" },
  { id: "rust", label: "Rust", file: "main.rs" },
  { id: "go", label: "Go", file: "main.go" },
  { id: "html", label: "HTML", file: "index.html" },
  { id: "css", label: "CSS", file: "style.css" },
  { id: "json", label: "JSON", file: "data.json" },
];

const DEFAULT_CODE: Record<string, string> = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
  javascript: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));\n`,
  typescript: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));\n`,
  python: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
  rust: `fn main() {\n    println!("Hello, World!");\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>\n`,
  css: `body {\n  margin: 0;\n  font-family: sans-serif;\n  background: #f0f0f0;\n}\n`,
  json: `{\n  "message": "Hello, World!",\n  "version": 1\n}\n`,
};

interface EditorProp {
  Id: string;
}

export default function CollaborativeEditor({ Id }: EditorProp) {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [langId, setLangId] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE["cpp"]);
  const [isDark, setIsDark] = useState(true);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.id === langId)!;
  const roomId: string = Id;
  const handleLangChange = (id: string) => {
    setLangId(id);
    setCode(DEFAULT_CODE[id] ?? "");
    sendLanguageChanged(roomId, id);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);

  useEffect(() => {
    let binding: MonacoBinding;

    if (editorRef) {
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText("monaco");

      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as unknown as YProtocolAwareness,
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, room]);

  useEffect(() => {
    joinRoom(roomId);

    const onLanguageChanged = (data: any) => {
      const incomingRoomId = data?.payload?.roomId;
      const incomingLang = data?.payload?.language;

      if (incomingRoomId !== roomId) return;
      if (!incomingLang) return;

      setLangId(incomingLang);
    };

    addListener(WS_EVENTS.LANGUAGE_CHANGED, onLanguageChanged);

    return () => {
      removeListener(WS_EVENTS.LANGUAGE_CHANGED, onLanguageChanged);
    };
  }, [roomId]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
    e.onDidChangeCursorPosition(() => {
      const pos = e.getPosition();
      setCursor({ line: pos?.lineNumber ?? 1, col: pos?.column ?? 1 });
    });
  }, []);

  // return (
  //   <Editor
  //     onMount={handleOnMount}
  //     height="100vh"
  //     width="100%"
  //     theme="vs-daark"
  //     defaultLanguage="typescript"
  //     defaultValue=""
  //     options={{
  //       tabSize: 2,
  //     }}
  //   />
  // );
  return (
    <div
      className="flex flex-col w-full h-screen"
      style={{ background: isDark ? "#0d1117" : "#f6f8fa" }}
    >
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
        style={{
          background: isDark ? "#161b22" : "#ffffff",
          borderColor: isDark ? "#30363d" : "#d0d7de",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#58a6ff,#bc8cff)" }}
          >
            {"</>"}
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: isDark ? "#e6edf3" : "#24292f" }}
          >
            pairCode
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={langId}
            onChange={(e) => handleLangChange(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-md border cursor-pointer outline-none"
            style={{
              background: isDark ? "#21262d" : "#f6f8fa",
              color: isDark ? "#e6edf3" : "#24292f",
              borderColor: isDark ? "#30363d" : "#d0d7de",
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark((d) => !d)}
            title="Toggle theme"
            className="w-8 h-8 rounded-md flex items-center justify-center border text-base transition-opacity hover:opacity-80"
            style={{
              background: isDark ? "#21262d" : "#f6f8fa",
              borderColor: isDark ? "#30363d" : "#d0d7de",
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-md border font-medium transition-all"
            style={{
              background: copied
                ? isDark
                  ? "#238636"
                  : "#2da44e"
                : isDark
                  ? "#21262d"
                  : "#f6f8fa",
              color: copied ? "#ffffff" : isDark ? "#e6edf3" : "#24292f",
              borderColor: isDark ? "#30363d" : "#d0d7de",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

          {/* Share button */}
          <button
            className="text-xs px-3 py-1.5 rounded-md font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#58a6ff,#bc8cff)" }}
          >
            <ShareButton roomId={roomId!} />
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div
        className="flex items-end px-3 pt-2 shrink-0 border-b"
        style={{
          background: isDark ? "#161b22" : "#ffffff",
          borderColor: isDark ? "#30363d" : "#d0d7de",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t-md border-t border-l border-r -mb-px"
          style={{
            background: isDark ? "#0d1117" : "#f6f8fa",
            borderColor: isDark ? "#30363d" : "#d0d7de",
            color: isDark ? "#e6edf3" : "#24292f",
          }}
        >
          <span style={{ color: isDark ? "#58a6ff" : "#0969da" }}>●</span>
          {currentLang.file}
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={langId}
          value={code}
          theme={isDark ? "vs-dark" : "light"}
          onChange={(value) => setCode(value ?? "")}
          onMount={handleOnMount}
          options={{
            fontSize: 14,
            fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            lineNumbers: "on",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            wordWrap: "on",
          }}
        />
      </div>

      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-4 py-1 text-xs shrink-0 border-t"
        style={{
          background: isDark ? "#161b22" : "#ffffff",
          borderColor: isDark ? "#30363d" : "#d0d7de",
          color: isDark ? "#8b949e" : "#57606a",
        }}
      >
        <div className="flex items-center gap-4">
          <span>
            Ln {cursor.line}, Col {cursor.col}
          </span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: isDark ? "#3fb950" : "#1a7f37" }}>
            ⬤ Connected
          </span>
          <span>{currentLang.label}</span>
        </div>
      </div>
    </div>
  );
}
