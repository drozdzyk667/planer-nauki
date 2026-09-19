"use client";
import CodeMirror, { EditorView, Prec } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useLocale } from "@/components/providers";
export default function CodeEditor({
  code,
  onChange,
  language = "javascript",
}: {
  code: string;
  onChange: (code: string) => void;
  language?: "javascript" | "typescript" | "tsx";
}) {
  const { t, resolvedTheme } = useLocale();
  return (
    <CodeMirror
      value={code}
      height="240px"
      theme={resolvedTheme}
      extensions={[
        javascript({
          typescript: language === "typescript" || language === "tsx",
          jsx: language === "tsx",
        }),
        EditorView.contentAttributes.of({ "aria-label": t.editor }),
        Prec.highest(
          EditorView.theme({
            "&": { backgroundColor: "var(--code-bg)", color: "var(--code-fg)" },
            ".cm-activeLine, .cm-activeLineGutter": {
              backgroundColor: "var(--surface)",
            },
            ".cm-gutters": {
              backgroundColor: "var(--code-bg)",
              color: "var(--quiet)",
              border: "0",
            },
            "&.cm-focused": {
              outline: "2px solid var(--focus)",
              outlineOffset: "-2px",
            },
          }),
        ),
      ]}
      onChange={onChange}
      indentWithTab={false}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: false,
      }}
    />
  );
}
