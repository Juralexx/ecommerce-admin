import { Add, Remove } from '@mui/icons-material'
import React from 'react'
import styled from 'styled-components'

export const addClass = (state: boolean, classe: string) => {
    if (state) return classe
    else return 'un' + classe
}

const NumberInput = (props: any) => {
    const { style, icon, endIcon, isError, isSuccess, onClean, onChange, ...others } = props

    const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)

    return (
        <Container style={style}>
            {props.name &&
                <label className={`${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`}>
                    {props.name}
                </label>
            }
            <InputContainer className={`input-container ${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`}>
                {icon &&
                    <div className='start-icon'>
                        {icon}
                    </div>
                }
                <input
                    ref={inputRef}
                    type="number"
                    {...others}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                />
                <div className='end-icons'>
                    <Remove onClick={() => {
                        inputRef.current?.stepDown();
                        onChange(inputRef.current?.value)
                    }} />
                    <Add onClick={() => {
                        inputRef.current?.stepUp();
                        onChange(inputRef.current?.value)
                    }} />
                </div>
            </InputContainer>
        </Container>
    )
}

export default NumberInput

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

const InputContainer = styled.div`
    font-weight      : 400;
    font-size        : 1rem;
    line-height      : 1.4375em;
    letter-spacing   : 0.00938em;
    color            : var(--text);
    position         : relative;
    cursor           : text;
    display          : inline-flex;
    align-items      : center;
    background-color : var(--bg-two);
    height           : 40px;
    padding-top      : 6px;
    padding-bottom   : 5px;
    padding-left     : 12px;
    padding-right    : 4px;
    border-radius    : var(--rounded-sm);
    width            : 100%;
    border           : 1px solid var(--light-border);
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    .start-icon {
        display      : flex;
        align-items  : center;
        margin-right : 8px;
    }
    .end-icons {
        display     : flex;
        align-items : center;
        margin-left : 8px;

        svg {
            width         : 28px;
            height        : 28px;
            padding       : 5px;
            border-radius : var(--rounded-full);

            &:hover {
                background : var(--bg-one);
            }

            &:nth-child(2) {
                margin-left : 3px;
            }
        }
    }

    svg {
        width       : 20px;
        height      : 20px;
        margin-top  : 2px;
        display     : inline-block;
        fill        : currentColor;
        flex-shrink : 0;
        transition  : fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size   : 1.5rem;
        color       : var(--text-secondary);
        cursor      : pointer;
    }

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
        min-width          : 0;
        width              : 100%;
        animation-name     : mui-auto-fill-cancel;
        animation-duration : 10ms;
        -webkit-appearance : textfield;
        -moz-appearance    : textfield;
        appearance         : textfield;

        &::-webkit-inner-spin-button, 
        &::-webkit-outer-spin-button { 
            -webkit-appearance: none;
        }

        &::placeholder {
            color : var(--placeholder);
        }

        &:read-only {
            cursor : pointer;
        }
    }

    &:focus-within {
        box-shadow : 0 0 0 2px var(--primary);
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