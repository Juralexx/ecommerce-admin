import React from 'react'
import ReactQuill from "react-quill";
import EditorToolbar, { formats, modules } from "./EditorToolbar";
import styled from 'styled-components';

interface Props {
    id?: string,
    value: any,
    onChange: (props: any) => any,
    max?: number,
    maxHeight?: string,
    minHeight?: string
}

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const Wysiwyg = ({ id = 'toolbar', value, onChange, max = 100000, maxHeight = '500px', minHeight = '100px' }: Props) => {
    const [count, setCount] = React.useState(0)
    const quillRef = React.useRef() as React.MutableRefObject<any>

    const handleChange = (text: any, delta: any, source: any, editor: any) => {
        setCount(editor.getText().length - 1)

        quillRef.current?.getEditor().on('text-change', () => {
            if (editor.getLength() > max) {
                quillRef.current.getEditor().deleteText(max, editor.getLength());
            }
        })

        return editor.getContents()
    }

    const module: { [key: string]: any } = modules({ id: `#${id}` })

    return (
        <EditorContainer {...{ maxHeight, minHeight }}>
            <EditorToolbar id={id} />
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={(text: any, delta: any, source: any, editor: any) => onChange(handleChange(text, delta, source, editor))}
                modules={module}
                formats={formats}
            />
            <p style={{ marginTop: 5, fontSize: 12 }}>
                {count} / {numberWithSpaces(max)} caractères
            </p>
        </EditorContainer>
    )
}

export default Wysiwyg

const EditorContainer = styled.div<{ maxHeight: string, minHeight: string }>`
    ${({ maxHeight }) => maxHeight && `
        .ql-editor {
            max-height: ${maxHeight};
        }
    `}
    ${({ minHeight }) => minHeight && `
        .ql-editor {
            min-height: ${minHeight};
        }
    `}
`