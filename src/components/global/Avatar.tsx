import React from 'react'
import styled from 'styled-components'

interface Props {
    children?: React.ReactNode;
    rounded?: string;
    width?: number;
    height?: number;
    fontSize?: number,
    background?: string;
    backgroundImage?: string;
    [key: string]: any;
}

const Avatar = (props: Props) => {
    const { children, rounded, width, height, fontSize, backgroundImage, background, ...others } = props
    return (
        <AvatarContainer {...others} {...{ rounded, width, height, fontSize, backgroundImage, background }}>
            {children}
        </AvatarContainer>
    )
}

export default Avatar

const AvatarContainer = styled.div<Props>`
    position        : relative;
    display         : flex;
    align-items     : center;
    justify-content : center;
    flex-shrink     : 0;
    width           : ${({ width }) => width ? `${width}px` : '34px'};
    height          : ${({ height }) => height ? `${height}px` : '34px'};
    font-size       : ${({ fontSize }) => fontSize ? `${fontSize}px` : '1.4rem'};
    line-height     : 1;
    border-radius   : ${({ rounded }) => rounded ? `var(--rounded-${rounded})` : '50%'};
    overflow        : hidden;
    user-select     : none;
    color           : var(--text);
    background      : var(--primary);

    ${({ rounded }) => rounded && `
        font-size : 0.8rem;
        height    : 32px;
    `};
    ${({ backgroundImage }) => backgroundImage && `
        background-image    : url(${backgroundImage});
        background-repeat   : no-repeat;
        background-position : center;
        background-size     : cover;
    `};
    ${({ background }) => background && `
        background : ${background};
    `};
`