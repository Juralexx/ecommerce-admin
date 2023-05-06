import React from 'react'
import styled, { css } from 'styled-components'

const ImageBG = (props: any) => {
    const { children, onClick, ...others } = props
    return (
        <ImageContainer {...others} onClick={onClick}>
            {props.children}
        </ImageContainer>
    )
}

export default ImageBG

const ImageContainer = styled.div<{ onClick: any }>`
    position      : relative;
    padding       : 20px;
    border-radius : var(--rounded-sm);
    border        : 1px solid var(--light-border);
    background    : repeating-conic-gradient(rgb(var(--bg-two-rgb)) 0%, rgb(var(--bg-two-rgb)) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;

    ${({ onClick }) => onClick && css`
        &:hover {
            cursor     : pointer;
            border     : 1px solid var(--primary);
            background : repeating-conic-gradient(rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.2) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
        }
    `};

    > svg {
        display       : block;
        height        : 70px;
        width         : 70px;
        padding       : 15px;
        margin        : 0 auto;
        color         : var(--primary);
        background    : var(--bg-zero);
        border-radius : var(--rounded-sm);
    }

    p {
        margin-top : 5px;
        text-align : center;
    }
`