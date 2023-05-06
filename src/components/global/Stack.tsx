import React from 'react'
import styled from 'styled-components'
import { getMinBreakpoints } from '@/functions/utils'

interface Props {
    children?: React.ReactNode ,
    direction?: string | Record<string, any>,
    spacing?: number | Record<string, any>,
    alignItems?: string | Record<string, any>,
    justifyContent?: string | Record<string, any>,
    width?: string | Record<string, any>,
    divider?: JSX.Element | HTMLElement,
    style?: React.CSSProperties,
    [key: string]: any
}

const Stack = (props: Props) => {
    const { children, direction, spacing, justifyContent, alignItems, width, divider, style, ...others } = props

    return (
        <StackContainer {...{ direction, spacing, justifyContent, alignItems, width }} style={style} { ...others }>
            {React.Children && (
                divider ? (
                    React.Children!.map(children, (child: any, i: number) => {
                        return (
                            <React.Fragment key={i}>
                                {child}
                                {i < Object.keys(children!)!.length - 1 &&
                                    divider
                                }
                            </React.Fragment>
                        );
                    })
                ) : children)}
        </StackContainer>
    )
}

export default Stack

const StackContainer = styled.div<Props> `
    position    : relative;
    display     : flex;
    align-items : center;
    max-width   : 100%;

    ${props => props.spacing && `
        ${getSpacings(props.spacing)}
    `};

    ${props => props.spacing && props.direction && `
        ${getSpacingFromDirection(props.spacing, props.direction)}
    `};

    ${props => props.direction && `
        ${getDirections(props.direction)}
    `};

    ${props => props.justifyContent && `
        ${getJustifyContent(props.justifyContent)}
    `};

    ${props => props.alignItems && `
        ${getAlignItems(props.alignItems)}
    `};

    ${props => props.width && `
        ${getWidth(props.width)}
    `};
`

const getSpacings = (spacing: Props['spacing']) => {
    if (typeof spacing === 'object') {
        return Object.entries(spacing).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                        > *:not(:first-child) {
                            margin      : 0;
                            margin-left : ${value * 8}px;
                        };
                    };`
            )
        }).join(' ')
    }
    if (typeof spacing === 'number') {
        return (
            `> *:not(:first-child) {
                margin      : 0;
                margin-left : ${spacing * 8}px;
            };`
        )
    }
}

const getDirections = (direction: Props['direction']) => {
    if (typeof direction === 'object') {
        return Object.entries(direction).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    flex-direction : ${value};
                };`
            )
        }).join(' ')
    }
    if (typeof direction === 'string') {
        return `flex-direction : ${direction};`
    }
}

const getSpacingFromDirection = (spacing: Props['spacing'], direction: Props['direction']) => {
    if (spacing) {
        if (typeof direction === 'object') {
            return Object.entries(direction).map(([key, value], i) => {
                return (
                    `@media(min-width: ${getMinBreakpoints(key)}px) {
                    > *:not(:first-child) {
                        margin      : 0;
                        margin-${getMargin(Object.values(direction)[i])} : ${(typeof spacing === 'number' ? spacing : Object.values(spacing)[i]) * 8}px;
                    };
                };`
                )
            }).join(' ')
        }
    }
}

const getJustifyContent = (justifyContent: Props['justifyContent']) => {
    if (typeof justifyContent === 'object') {
        return Object.entries(justifyContent).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    justify-content : ${value};
                };`
            )
        }).join(' ')
    }
    if (typeof justifyContent === 'string') {
        return `justify-content : ${justifyContent};`
    }
}

const getAlignItems = (alignItems: Props['alignItems']) => {
    if (typeof alignItems === 'object') {
        return Object.entries(alignItems).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    align-items : ${value};
                };`
            )
        }).join(' ')
    }
    if (typeof alignItems === 'string') {
        return `align-items : ${alignItems};`
    }
}

const getWidth = (width: Props['width']) => {
    if (typeof width === 'object') {
        return Object.entries(width).map(([key, value], i) => {
            return (
                `@media(min-width: ${getMinBreakpoints(key)}px) {
                    width : ${value};
                };`
            )
        }).join(' ')
    }
    if (typeof width === 'string') {
        return `width : ${width};`
    }
}

const getMargin = (direction: any) => {
    if (direction === "column")
        return 'top'
    if (direction === 'row')
        return 'left'
}