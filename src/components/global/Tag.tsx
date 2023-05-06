import React from 'react'
import styled from 'styled-components'

interface Props {
    children?: React.ReactNode;
    name?: string;
    bgColor?: string;
    beforeColor?: string;
    color?: string;
    rounded?: string;
    noBorder?: boolean;
    [key: string]: any;
}

const Tag = (props: Props) => {
    const { children, name, bgColor, color, beforeColor, rounded, ...others } = props
    return (
        <TagContainer {...{ bgColor, color, beforeColor, rounded, ...others }}>
            {name}
            {children}
        </TagContainer>
    )
}

export default Tag

const TagContainer = styled.div<Props>`
    position      : relative;
    display       : inline-flex;
    align-items   : center;
    background    : var(--bg-zero);
    padding       : 5px 10px;
    border-radius : var(--rounded-sm);
    border        : 1px solid var(--light-border);
    font-size     : 1rem;
    white-space   : nowrap;

    ${({ bgColor }) => bgColor && `
        background : var(--${bgColor});
    `};
    ${({ color }) => color && `
        color : var(--${color});
    `};
    ${({ rounded }) => rounded && `
        border-radius : var(--rounded-${rounded});
    `};

    ${({ beforeColor }) => beforeColor && `
        padding-left:25px;

        &:before {
            position         : absolute;
            content          : '';
            top              : 50%;
            transform        : translateY(-25%);
            left             : 10px;
            width            : 7px;
            height           : 7px;
            border-radius    : var(--rounded-full);
            background-color : var(--${beforeColor});
        }
    `};
    ${({ noBorder }) => noBorder && `
        border: none;
    `};

    svg {
        width  : 14px;
        height : 14px;
    }
`