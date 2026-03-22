"use client";
import { useRoom } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
// import { useRoom } from "../../liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import type { Awareness as YProtocolAwareness } from "y-protocols/awareness";
import {  useParams,useNavigate } from "react-router-dom";



export default function CollaborativeEditor() {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const room = useRoom();
  const yProvider = getYjsProviderForRoom(room);
  const navigate = useNavigate();

  const {roomId}=useParams();
  if (!roomId) {
    navigate("/", { replace: true });
  }
  

 
  useEffect(() => {
    let binding: MonacoBinding;

    if (editorRef) {
      const yDoc = yProvider.getYDoc();
      const yText = yDoc.getText("monaco");

      
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as unknown as YProtocolAwareness
      );
    }

    return () => {
      binding?.destroy();
    };
  }, [editorRef, room]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <Editor
      onMount={handleOnMount}
      height="100vh"
      width="100%"
      theme="vs-light"
      defaultLanguage="typescript"
      defaultValue=""
      options={{
        tabSize: 2,
      }}
    />
  );
}