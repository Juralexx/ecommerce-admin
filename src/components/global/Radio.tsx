import React from 'react'
import styled from 'styled-components'

interface Props {
    checked?: boolean;
    [key: string]: any;
}

const Radio = (props: Props) => {
    const { checked = false, ...others } = props

    return (
        <RadioButton className='radio' {...others}>
            <input type="radio" value="" checked={checked} onChange={() => { }} />
            <span>
                <svg className='circle' focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                </svg>
                <svg className='dot' focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z"></path>
                </svg>
            </span>
        </RadioButton>
    )
}

export default Radio

const RadioButton = styled.span`
    display          : inline-flex;
    align-items      : center;
    justify-content  : center;
    position         : relative;
    box-sizing       : border-box;
    background-color : transparent;
    outline          : 0;
    border           : 0;
    margin           : 0;
    border-radius    : 0;
    padding          : 0;
    cursor           : pointer;
    user-select      : none;
    vertical-align   : middle;
    appearance       : none;
    text-decoration  : none;
    color            : inherit;
    padding          : 9px;
    border-radius    : 50%;
    color            : rgba(0, 0, 0, 0.6);

    input {
        cursor   : inherit;
        position : absolute;
        opacity  : 0;
        width    : 100%;
        height   : 100%;
        top      : 0;
        left     : 0;
        margin   : 0;
        padding  : 0;
        z-index  : 1;

        &:checked {
            + span {
                svg {
                    &.dot {
                        transform : scale(1);
                        color     : var(--primary);
                    }
                    &.circle {
                        color : var(--primary);
                    }
                }
            }
        }
    }

    span {
        position : relative;
        display  : flex;
    }

    svg {
        &.circle {
            user-select : none;
            width       : 1em;
            height      : 1em;
            display     : inline-block;
            fill        : currentColor;
            flex-shrink : 0;
            transition  : fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            font-size   : 1.5rem;
        }
        &.dot {
            user-select : none;
            width       : 1em;
            height      : 1em;
            display     : inline-block;
            fill        : currentColor;
            flex-shrink : 0;
            transition  : fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            font-size   : 1.5rem;
            left        : 0;
            position    : absolute;
            transition  : transform 150ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
            transform   : scale(0);
        }
    }
`