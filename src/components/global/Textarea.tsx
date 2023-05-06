import React from 'react'
import styled from 'styled-components'

export const addClass = (state: boolean, classe: string) => {
    if (state) return classe
    else return 'un' + classe
}

const Textarea = (props: any) => {
    const { style, isError, isSuccess, ...others } = props

    const textareaRef: React.MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null)

    const expandHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
            if (e.target.value.length === 0) {
                textarea.style.removeProperty("height");
            }
        }
    }

    return (
        <Container style={style}>
            {props.name &&
                <label className={`${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`}>
                    {props.name}
                </label>
            }
            <TextareaContainer className={`${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`}>
                <textarea
                    {...others}
                    ref={textareaRef}
                    onClick={(e: React.ChangeEvent<HTMLTextAreaElement>) => expandHeight(e)}
                    onChange={(e) => {
                        props.onChange(e)
                        expandHeight(e)
                    }}
                />
            </TextareaContainer>
        </Container>
    )
}

export default Textarea

const Container = styled.div`
    label {
        display        : block;
        font-weight    : 400;
        font-size      : 1rem;
        line-height    : 1.5;
        letter-spacing : 0.00938em;
        margin-left    : 4px;
        margin-bottom  : 8px;
        color          : var(--text);

        &.error {
            color : var(--danger);
        }
        &.success {
            color : var(--success);
        }
    }
`

const TextareaContainer = styled.div`
    font-weight      : 400;
    font-size        : 1rem;
    line-height      : 1.5;
    letter-spacing   : 0.00938em;
    color            : var(--text);
    position         : relative;
    cursor           : text;
    display          : inline-flex;
    align-items      : center;
    background-color : var(--bg-two);
    height           : auto;
    min-height       : 70px;
    border-radius    : var(--rounded-sm);
    width            : 100%;
    border           : 1px solid var(--light-border);
    position         : relative;

    &::-webkit-resizer {
        color : var(--primary);
    }

    &:focus-within {
        box-shadow : 0 0 0 2px var(--primary);
    }

    textarea {
        font               : inherit;
        letter-spacing     : inherit;
        color              : currentColor;
        padding            : 4px 0;
        border             : 0;
        box-sizing         : content-box;
        outline            : none;
        background         : none;
        min-height         : 70px;
        max-height         : 150px;
        min-width          : 0;
        width              : 100%;
        margin             : 0;
        display            : block;
        padding-left       : 15px;
        padding-right      : 15px;
        padding-top        : 10px;
        padding-bottom     : 10px;
        resize             : vertical;
        animation-name     : mui-auto-fill-cancel;
        animation-duration : 10ms;

        &::placeholder {
            color : var(--placeholder);
        }
    }

    &.error {
        border-color     : var(--danger);
        background-color : rgba(var(--danger-rgb), 0.1);

        svg {
            color : var(--danger);
        }
    }

    &.success {
        border-color     : var(--success);
        background-color : rgba(var(--success-rgb), 0.1);

        svg {
            color : var(--success);
        }
    }
`