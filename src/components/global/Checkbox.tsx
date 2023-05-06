import React from 'react'
import styled from 'styled-components'

interface Props {
    uniqueKey?: string,
    checked?: boolean,
    onChange?: React.ChangeEventHandler<any>,
    [key: string]: any
}

const Checkbox = (props: Props) => {
    const { uniqueKey, checked, onChange = () => { }, ...others } = props
    return (
        <CheckBox key={uniqueKey} {...others}>
            <input id={uniqueKey} name={uniqueKey} type="checkbox" checked={checked} onChange={onChange} />
            <label htmlFor={uniqueKey}>
                <span>
                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1"></polyline>
                    </svg>
                </span>
            </label>
        </CheckBox>
    )
}

export default Checkbox

const CheckBox = styled.div`
    position : relative;

    label {
        transform                   : scale(0.8);
        -webkit-user-select         : none;
        user-select                 : none;
        -webkit-tap-highlight-color : transparent;
        cursor                      : pointer;
        z-index                     : 1;

        span {
            display          : inline-block;
            vertical-align   : middle;
            transform        : translate3d(0, 0, 0);
            position         : relative;
            width            : 24px;
            height           : 24px;
            border-radius    : var(--rounded-md);
            transform        : scale(0.8);
            vertical-align   : middle;
            border           : 1px solid #B9B8C3;
            background-color : var(--bg-two);
            transition       : all .2s ease;

            svg {
                position          : absolute;
                z-index           : 1;
                top               : 8px;
                left              : 5px;
                fill              : none;
                stroke            : white;
                stroke-width       : 2;
                stroke-linecap    : round;
                stroke-linejoin   : round;
                stroke-dasharray  : 16px;
                stroke-dashoffset : 16px;
                transition        : all .3s ease;
                transition-delay  : .1s;
                transform         : translate3d(0, 0, 0);
            }

            &:before {
                content          : "";
                width            : 100%;
                height           : 100%;
                background       : #506EEC;
                display          : block;
                transform        : scale(0);
                opacity          : 1;
                border-radius    : var(--rounded-md);
                transition-delay : .2s;
            }
        }
    }

    input {
        opacity    : 0;
        position   : absolute;
        left       : 0;
        max-width  : 24px;
        min-height : 24px;
        z-index    : 2;
        cursor     : pointer;

        &:checked {

            + label span {
                border-color : rgba(var(--primary-rgb), 0.5);
                background   : rgba(var(--primary-rgb), 0.5);
                animation    : check .6s ease;

                svg {
                    stroke-dashoffset : 0;
                }

                &:before {
                    transform  : scale(2.2);
                    opacity    : 0;
                    transition : all .6s ease;
                }
            }

            &:hover + label span {
                background-color : rgba(var(--primary-rgb), 0.5);
            }
        }

        &:hover + label span {
            border-color  : rgba(var(--primary-rgb), 0.5);
            border-radius : var(--rounded-sm);
        }
    }

    @keyframes check {
        50% {
            transform : scale(1.2);
        }
    }
`