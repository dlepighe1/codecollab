import React, { useRef, useEffect } from 'react';
import { EditorState, Extension, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { yCollab } from 'y-codemirror.next';
import type { Text as YText } from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
import { LANGUAGE_MAP } from '../../../constants/languages';

interface CodeMirrorEditorProps {
    language: string;
    content: string;
    onChange: (value: string) => void;
    onCursorChange?: (pos: { lineNumber: number; column: number }) => void;
    fontSize?: number;
    themeExtensions?: Extension[];
    extraExtensions?: Extension[];
    ytext?: YText;
    awareness?: Awareness;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
    language,
    content,
    onChange,
    onCursorChange,
    fontSize = 14,
    themeExtensions = [],
    extraExtensions = [],
    ytext,
    awareness,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const onCursorChangeRef = useRef(onCursorChange);
    const fontCompartment = useRef(new Compartment());
    const themeCompartment = useRef(new Compartment());

    // Keep refs in sync
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => { onCursorChangeRef.current = onCursorChange; }, [onCursorChange]);

    const makeFontTheme = (size: number) => EditorView.theme({
        '.cm-content': { fontFamily: "'Fira Code', monospace", fontSize: `${size}px` },
        '.cm-gutters': { fontFamily: "'Fira Code', monospace", fontSize: `${size}px` },
        '&': { height: '100%' },
        '.cm-scroller': { overflow: 'auto' },
    });

    // Create editor on mount or when language changes
    useEffect(() => {
        if (!containerRef.current) return;

        const langConfig = LANGUAGE_MAP[language];
        const langExtensions = langConfig ? langConfig.codemirror() : [];

        const updateListener = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                onChangeRef.current(update.state.doc.toString());
            }
            if (update.selectionSet && onCursorChangeRef.current) {
                const pos = update.state.selection.main.head;
                const line = update.state.doc.lineAt(pos);
                onCursorChangeRef.current({
                    lineNumber: line.number,
                    column: pos - line.from + 1,
                });
            }
        });

        const extensions: Extension[] = [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            history(),
            bracketMatching(),
            closeBrackets(),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap]),
            ...langExtensions,
            themeCompartment.current.of(themeExtensions),
            fontCompartment.current.of(makeFontTheme(fontSize)),
            ...extraExtensions,
        ];

        if (ytext) {
            // Yjs-managed document: yCollab handles content sync + remote cursors
            extensions.push(yCollab(ytext, awareness || null));
        } else {
            // Standalone mode: use local content + onChange
            extensions.push(updateListener);
        }

        const state = EditorState.create({
            doc: ytext ? undefined : content,
            extensions,
        });

        const view = new EditorView({ state, parent: containerRef.current });
        viewRef.current = view;

        return () => { view.destroy(); viewRef.current = null; };
    }, [language]); // Recreate only when language changes

    // Sync content from external updates (e.g., switching active file)
    useEffect(() => {
        if (ytext) return; // Yjs manages content
        const view = viewRef.current;
        if (!view) return;
        const currentContent = view.state.doc.toString();
        if (currentContent !== content) {
            view.dispatch({
                changes: { from: 0, to: currentContent.length, insert: content },
            });
        }
    }, [content, ytext]);

    // Update font size dynamically via compartment
    useEffect(() => {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
            effects: fontCompartment.current.reconfigure(makeFontTheme(fontSize)),
        });
    }, [fontSize]);

    // Update theme dynamically via compartment
    useEffect(() => {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
            effects: themeCompartment.current.reconfigure(themeExtensions),
        });
    }, [themeExtensions]);

    return (
        <div ref={containerRef} className="h-full w-full overflow-hidden" />
    );
};

export default CodeMirrorEditor;
