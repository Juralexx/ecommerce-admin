import React from 'react'
import styled from 'styled-components'
import { Close } from '@mui/icons-material'
import useClickOutside from './hooks/useClickOutside'

interface Props {
    onTag?: (...args: any) => void
}

const TagInput = ({ onTag }: Props) => {
    const [value, setValue] = React.useState<string>('')
    const [tags, setTags] = React.useState<any[]>([])
    const containerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)
    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)

    useClickOutside(containerRef, () => addTag())

    function addTag() {
        if (value.length > 0) {
            setTags(prev => [...prev, value])
            setValue('')
            if (onTag) {
                onTag(tags)
            }
        }
    }

    function deleteTag(array: any[], key: number) {
        let arr = [...array]
        arr.splice(key, 1)
        return arr
    }

    function handleKeyDown(event: any) {
        if (event.which === 13) {
            addTag()
        }
    }

    function focusInput(event: any) {
        if (event.target.nodeName !== 'path' && event.target.nodeName !== 'svg') {
            inputRef.current!.focus()
        }
    }

    return (
        <TagInputContainer
            ref={containerRef}
            onClick={event => focusInput(event)}
        >
            {tags.map((tag, i) => {
                return (
                    <div className='tag'>
                        {tag}
                        <Close onClick={() => {
                            setTags(deleteTag(tags, i))
                            if (onTag) {
                                onTag(deleteTag(tags, i))
                            }
                        }} />
                    </div>
                )
            })}
            <input
                ref={inputRef}
                value={value}
                onChange={event => setValue(event.target.value)}
                onKeyDown={event => handleKeyDown(event)}
                style={{ marginLeft: tags.length > 0 ? '10px' : 0 }}
            />
        </TagInputContainer>
    )
}

export default TagInput

const TagInputContainer = styled.div`
    font-weight      : 400;
    font-size        : 1rem;
    line-height      : 1.4375em;
    letter-spacing   : 0.00938em;
    color            : var(--text);
    position         : relative;
    display          : inline-flex;
    align-items      : center;
    flex-wrap        : wrap;
    background-color : var(--bg-two);
    height           : auto;
    padding-top      : 6px;
    padding-bottom   : 5px;
    padding-left     : 12px;
    padding-right    : 12px;
    border-radius    : var(--rounded-sm);
    width            : 100%;
    border           : 1px solid var(--light-border);
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    input {
        font               : inherit;
        letter-spacing     : inherit;
        color              : currentColor;
        padding            : 4px 0;
        border             : 0;
        box-sizing         : content-box;
        outline            : none;
        background         : none;
        height             : 1.4375em;
        margin             : 0;
        display            : block;
        width              : 150px;
        animation-name     : mui-auto-fill-cancel;
        animation-duration : 10ms;

        &::placeholder {
            color : var(--placeholder);
        }
    }

    &:focus-within {
        box-shadow : 0 0 0 2px var(--primary);
    }
    
    .tag {
        position      : relative;
        display       : inline-flex;
        align-items   : center;
        background    : var(--bg-zero);
        padding       : 5px 10px 7px;
        margin-right  : 5px;
        border-radius : var(--rounded-sm);
        border        : 1px solid var(--light-border);
        font-size     : 1rem;
        white-space   : nowrap;

        svg {
            width         : 16px;
            height        : 16px;
            margin-left   : 8px;
            margin-bottom : -4px;
            cursor        : pointer;
        }
    }
`