import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
    children?: React.ReactNode,
    icon?: React.ReactNode,
    noBg?: boolean,
    small?: boolean,
    [key: string]: any
}

const IconButton = (props: Props) => {
    const { children, noBg, small, icon, ...others } = props
    return (
        <IconButtonContainer {...others} noBg={noBg} small={small}>
            <span>
                {icon}
                {children}
            </span>
        </IconButtonContainer>
    )
}

export default IconButton

const IconButtonContainer = styled.div<Props>`
    display         : inline-flex;
    align-items     : center;
    justify-content : center;
    position        : relative;
    box-sizing      : border-box;
    outline         : 0;
    padding         : 0;
    vertical-align  : middle;
    color           : inherit;
    font-size       : 16px;
    text-align      : center;
    text-transform  : none;
    text-decoration : none;
    flex            : 0 0 auto;
    font-size       : 1em;
    border-radius   : var(--rounded-sm);
    overflow        : visible;
    color           : rgba(0, 0, 0, 0.54);
    border          : 1px solid transparent;
    cursor          : pointer;
    transition      : background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    ${({ noBg }) => !noBg && css`
        background-color : var(--bg-zero);
        border           : 1px solid var(--light-border);
        padding          : ${({ small }: Props) => small ? '3px' : '5px'};

        span {
            background-color : var(--bg-one);
        }

        &:hover {
            border : 1px solid var(--primary);
            span {
                background-color : var(--primary-dark);
            }
            svg {
                color : var(--text);
            }
        }
    `};
    ${({ noBg }) => noBg && css`
        &:hover {
            span {
                background-color : var(--bg-two);
            }
        }
    `};

    span {
        width           : 100%;
        height          : 100%;
        display         : flex;
        align-items     : center;
        justify-content : center;
        padding         : ${({ small }) => small ? '3px' : '6px'};
        border-radius   : var(--rounded-xs);

        ${({ noBg }) => noBg === false && css`
            background-color : rgba(0, 0, 0, 0);
        `}
    }

    svg {
        width          : ${({ small }) => small ? '20px' : '1.5rem'};
        height         : ${({ small }) => small ? '20px' : '1.5rem'};
        display        : inline-block;
        vertical-align : middle;
        fill           : currentColor;
        flex-shrink    : 0;
        transition     : fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        color          : var(--text);
    }
`