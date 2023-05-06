import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

/**
 * Delta convertion
 */

export function convertEditorToHTML(string) {
    let callback = {}
    let converter = new QuillDeltaToHtmlConverter(string.text[0].ops, callback)
    let html = converter.convert(string.text[0].ops)
    return ({ __html: html })
}

export function convertEditorToString(string) {
    let callback = {}
    let converter = new QuillDeltaToHtmlConverter(string.text[0].ops, callback)
    let html = converter.convert(string.text[0].ops)
    return html
}

export function convertDeltaToHTML(string) {
    let callback = {}
    let converter = new QuillDeltaToHtmlConverter(string.ops, callback)
    let html = converter.convert(string.ops)
    return ({ __html: html })
}

export function convertDeltaToString(string) {
    let callback = {}
    let converter = new QuillDeltaToHtmlConverter(string.ops, callback)
    let html = converter.convert(string.ops)
    return html
}

/**
 * Convert editor to string and reduce string length
 */

export function parseDescription(project) {
    let description = project.content[0].ops
    let callback = {}
    let converter = new QuillDeltaToHtmlConverter(description, callback)
    let html = converter.convert(description)
    if (html.length >= 170) {
        if (html.substring(169, 170) === " ") {
            let cleanSpaces = html.replace(html.substring(169, 170), "")
            html = cleanSpaces.substring(0, 170) + "..."
        }
        html = html.substring(0, 170) + "..."
    }
    return html
}