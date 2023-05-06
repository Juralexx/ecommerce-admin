import React from "react";
import { Quill } from "react-quill"

function undoChange() {
    this.quill.history.undo()
}
function redoChange() {
    this.quill.history.redo()
}

const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];

const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];

Quill.register(Size, true);
Quill.register(Font, true);

export const modules = ({ id }) => {
    return {
        toolbar: {
            container: id,
            handlers: {
                undo: undoChange,
                redo: redoChange
            },
        },
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true
        }
    }
}

export const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
    "color",
    "code-block",
    "strike",
    "list",
    "bullet",
    // "font",
    "size",
    // "align",
    // "blockquote",
    // "background",
    // "indent",
];

export const QuillToolbar = ({ id }) => (
    <div id={id}>
        <span className="ql-formats">
            <button className="ql-header" label="Titre" value="1" />
            <button className="ql-header" label="Titre" value="2" />
        </span>
        <span className="ql-formats">
            {/* <select className="ql-font" defaultValue="arial">
                <option value="arial">Arial</option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select> */}
            <select className="ql-size" defaultValue="medium">
                <option value="extra-small">8</option>
                <option value="small">12</option>
                <option value="medium">16</option>
                <option value="large">20</option>
            </select>
            {/* <select className="ql-header" defaultValue="3">
                <option value="3">Texte</option>
                <option value="2">Sous-titre</option>
                <option value="1">Titre</option>
            </select> */}
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        {/* <span className="ql-formats">
            <button className="ql-blockquote" />
            <button className="ql-direction" />
        </span> */}
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            {/* <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" /> */}
        </span>
        {/* <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span> */}
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            {/* <button className="ql-video" /> */}
        </span>
        <span className="ql-formats">
            <button className="ql-clean" />
            {/* <button className="ql-formula" /> */}
            {/* <button className="ql-code-block" /> */}
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <svg viewBox="0 0 18 18">
                    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
                    <path
                        className="ql-stroke"
                        d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
                    />
                </svg>
            </button>
            <button className="ql-redo">
                <svg viewBox="0 0 18 18">
                    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
                    <path
                        className="ql-stroke"
                        d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
                    />
                </svg>
            </button>
        </span>
    </div>
)

export default QuillToolbar;