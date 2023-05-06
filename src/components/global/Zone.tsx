import React from 'react'
import styled from 'styled-components'

interface Props {
    children?: React.ReactNode;
    noPadding?: boolean;
    hover?: boolean;
    [key: string]: any;
}

const Zone = (props: Props) => {
    const { children, noPadding, hover, ...others } = props
    return (
        <ZoneContainer {...others} {...{ noPadding, hover }}>
            {children}
        </ZoneContainer>
    )
}

export default Zone

const ZoneContainer = styled.div<Props>`
    position         : relative;
    padding          : ${({ noPadding }) => !noPadding ? '20px' : '0'};
    margin-top       : 16px;
    background-color : var(--bg-zero);
    border-radius    : var(--rounded-sm);
    border           : 1px solid var(--light-border);
    transition       : 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    ${({ hover }) => hover && `
        &:hover {
            border : 1px solid var(--primary);
            cursor : pointer;
        }
    `};

    @media(max-width: 576px) {
        padding : 14px;
    }
`