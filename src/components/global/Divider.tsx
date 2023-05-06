import React from 'react'
import styled, { css } from 'styled-components'

const Divider = (props: any) => {
    const { orientation, ...others } = props

    return (
        <DividerContainer {...others} orientation={orientation} />
    )
}

export default Divider

const DividerContainer = styled.hr<{ orientation: string }>`
    flex-shrink         : 0;
    border-width        : 0;
    border-style        : solid;
    border-color        : var(--light-border);

    ${props => props.orientation !== 'vertical' && css`
        border-bottom-width : thin;
    `}

    ${props => props.orientation === 'vertical' && css`
        border-bottom-width : 0;
        height              : auto;
        border-right-width  : thin;
        align-self          : stretch;
    `}
`