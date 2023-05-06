import Link from 'next/link'
import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
    children?: React.ReactNode,
    variant?: string,
    color?: string,
    href?: string,
    icon?: any,
    endIcon?: any,
    mobileFull?: boolean,
    tabletFull?: boolean,
    noPadding?: boolean,
    small?: boolean,
    fullWidth?: boolean,
    selected?: boolean,
    [key: string]: any
}

const Button = (props: Props) => {
    const { children, icon, endIcon, href, ...others } = props

    return (
        <StyledButton {...others} {...{ endIcon, href }}>
            {!href ? (
                <React.Fragment>
                    {icon}
                    {children}
                    {endIcon}
                </React.Fragment>
            ) : (
                <Link href={href}>
                    {icon}
                    {children}
                    {endIcon}
                </Link>
            )}
        </StyledButton>
    )
}

export default Button

const StyledButton = styled.button<Props>`
    display         : flex;
    align-items     : center;
    justify-content : center;
    position        : relative;
    box-sizing      : border-box;
    outline         : 0;
    margin          : 0;
    cursor          : pointer;
    user-select     : none;
    text-decoration : none;
    font-size       : 1.1rem;
    font-weight     : 500;
    text-transform  : none;
    min-width       : 64px;
    width           : ${({ fullWidth }) => !fullWidth ? 'auto' : '100%'};
    border-radius   : var(--rounded-sm);
    transition      : background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow      : none;
    border          : 1px solid;

    ${({ href }) => !href && css`
        padding     : ${({ noPadding }: Props) => !noPadding ? '8px 30px 7px' : '8px 15px 7px'};
    `};
    ${({ href }) => href && css`
        a {
            display         : flex;
            align-items     : center;
            justify-content : center;
            padding         : ${({ noPadding }: Props) => !noPadding ? '8px 30px 7px' : '8px 15px 7px'};
        }
    `};
    ${({ small }) => small && css`
        font-size   : 0.8rem;
        height      : 32px;
    `};
    ${({ mobileFull }) => mobileFull && css`
        @media(max-width: 576px) {
            flex-grow : 1;
            width     : 100%;
        }
    `};
    ${({ tabletFull }) => tabletFull && css`
        @media(max-width: 768px) {
            flex-grow : 1;
            width     : 100%;
        }
    `};

    ${({ variant }) => !variant && css`
        background-color : var(--primary);
        color            : white;
        border-color     : var(--primary);

        &:hover {
            background-color : var(--primary-dark);
        }
    `};
    ${({ variant }) => variant === 'text' && css`
        background-color : transparent;
        color            : var(--text);
        border-color     : transparent;

        &:hover {
            color            : var(--primary-light);
            background-color : rgba(var(--primary-light-rgb), 0.2);
        }
    `};
    ${({ variant }) => variant === 'classic' && css`
        background-color : var(--bg-zero);
        color            : var(--text);
        border-color     : var(--light-border);

        &:hover {
            background-color : var(--bg-one);
        }
    `};
    ${({ variant }) => variant === 'delete' && css`
        background-color : var(--danger);
        color            : white;
        border-color     : var(--danger);

        &:hover {
            background-color : rgba(var(--danger-rgb), 0.7);
        }
    `};
    ${({ variant }) => variant === 'success' && css`
        background-color : var(--success);
        color            : white;
        border-color     : var(--success);

        &:hover {
            color            : var(--success);
            background-color : rgba(var(--success-rgb), 0.2);
        }
    `};
    ${({ color }: any) => color === 'primary' && css`
        color : var(--primary-light);
    `};
    ${({ color }: any) => color === 'delete' && css`
        color : var(--danger);
    `};

    svg {
        margin : ${({ endIcon }) => endIcon ? '0 0 0 10px' : '0 10px 0 0'};
        color  : currentColor;
    }

    input {
        position  : absolute;
        top       : 0;
        right     : 0;
        margin    : 0;
        padding   : 0;
        opacity   : 0;
        width     : 100%;
        height    : 100%;
        font-size : 0;
        cursor    : pointer;
        
        &::-webkit-file-upload-button {
            cursor : pointer;
        }
    }

    ${({ selected }) => selected && css`
        background-color : var(--primary);
        color            : white;
        border-color     : var(--primary);

        &:hover {
            background-color : var(--primary-dark);
        }
    `};

    &:active {
        transform  : scale(0.98);
        box-shadow : inset var(--shadow-sm);
    }

    &:disabled {
        border         : 1px solid rgb(74, 74, 106);
        background     : rgb(50, 50, 77);
        color          : rgb(165, 165, 186);
        cursor         : default;
        pointer-events : none;
    }
`