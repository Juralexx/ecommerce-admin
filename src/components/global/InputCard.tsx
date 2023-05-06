import React from 'react'
import styled from 'styled-components'
import { Close } from '@mui/icons-material'

export const addClass = (state: boolean, classe: string) => {
    if (state) return classe
    else return 'xyz'
}

const InputCard = (props: any) => {
    const { style, icon, endIcon, isError, isSuccess, onClean, onClick, ...others } = props

    return (
        <Container style={style} className={`input-container ${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`} onClick={onClick}>
            {props.name &&
                <label className={`${addClass(isError, 'error')} ${addClass(isSuccess, 'success')}`}>
                    {props.name}
                </label>
            }
            <InputContainer className='input-container'>
                {icon &&
                    <div className='start-icon'>
                        {icon}
                    </div>
                }
                <input
                    {...others}
                />
                {endIcon &&
                    <div className='end-icon' onClick={(e) => { onClean && onClean(); e.stopPropagation() }}>
                        {onClean && props.value.length > 0 ? (
                            <Close />
                        ) : (
                            endIcon
                        )}
                    </div>
                }
            </InputContainer>
        </Container>
    )
}

export default InputCard

const Container = styled.div`
    background-color : var(--bg-two);
    border           : 1px solid var(--light-border);
    padding          : 10px 15px 4px 15px;
    border-radius    : var(--rounded-sm);

    label {
        display        : block;
        font-weight    : 500;
        font-size      : 1rem;
        line-height    : 1.5;
        letter-spacing : 0.00938em;
        margin-bottom  : 0px;
        color          : var(--text);

        &.error {
            color : var(--danger);
        }
        &.success {
            color : var(--success);
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
    height           : 40px;
    padding-top      : 6px;
    padding-bottom   : 5px;
    width            : 100%;
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    .start-icon {
        display      : flex;
        align-items  : center;
        margin-right : 7px;
        color        : var(--text-secondary);
    }
    .end-icon {
        display     : flex;
        align-items : center;
        margin-left : 8px;
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

    &:has(input:read-only) {
        cursor : pointer;
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
`