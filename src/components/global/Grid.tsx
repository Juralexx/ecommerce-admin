import { getMinBreakpoints } from '@/functions/utils';
import React from 'react'
import styled from 'styled-components'

interface Props {
    children?: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
    spacing?: number | Record<string, any>;
    alignSelf?: string | Record<string, any>;
    [key: string]: any;
}

const Grid = (props: Props) => {
    const { children, xs, sm, md, lg, xl, xxl, xxxl, spacing, alignSelf, ...others } = props
    return (
        <GridContainer {...{ xs, sm, md, lg, xl, xxl, xxxl, spacing, alignSelf }} {...others}>
            {children}
        </GridContainer>
    )
}

export default Grid

const GridContainer = styled.div<Props>`
    display : grid;
    width   : 100%;
    height  : auto;

    ${props => props.xs && `
        @media(min-width: 0px) {
            grid-template-columns: repeat(${props.xs}, minmax(0, 1fr));
        };
    `};
    ${props => props.sm && `
        @media(min-width: 577px) {
            grid-template-columns: repeat(${props.sm}, minmax(0, 1fr));
        };
    `};
    ${props => props.md && `
        @media(min-width: 769px) {
            grid-template-columns: repeat(${props.md}, minmax(0, 1fr));
        };
    `};
    ${props => props.lg && `
        @media(min-width: 993px) {
            grid-template-columns: repeat(${props.lg}, minmax(0, 1fr));
        };
    `};
    ${props => props.xl && `
        @media(min-width: 1201px) {
            grid-template-columns: repeat(${props.xl}, minmax(0, 1fr));
        };
    `};
    ${props => props.xxl && `
        @media(min-width: 1537px) {
            grid-template-columns: repeat(${props.xxl}, minmax(0, 1fr));
        };
    `};
    ${props => props.xxxl && `
        @media(min-width: 1921px) {
            grid-template-columns: repeat(${props.xxxl}, minmax(0, 1fr));
        };
    `};

    ${props => props.spacing && `
        ${getSpacings(props.spacing)}
    `};
    ${props => props.alignItems && `
        ${getAlignItems(props.alignItems)}
    `};
`

const getSpacings = (spacing: Props['spacing']) => {
    if (typeof spacing === 'object') {
        return Object.entries(spacing).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    grid-gap: ${value * 8}px;
                };`
            )
        }).join(' ')
    }
    if (typeof spacing === 'number') {
        return (
            `grid-gap: ${spacing * 8}px;`
        )
    }
}

const getAlignItems = (alignItems: Props['alignItems']) => {
    if (typeof alignItems === 'object') {
        return Object.entries(alignItems).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    > * {
                        align-self : ${value};
                    }
                };`
            )
        }).join(' ')
    }
    if (typeof alignItems === 'string') {
        return `
        > * {
            align-self : ${alignItems};
        }`
    }
}