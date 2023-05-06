import React from 'react'
import styled from 'styled-components'

export const Tabs = (props: any) => {
    const { children, ...others } = props
    return (
        <TabsContainer {...others}>
            <TabsScroller>
                <TabsFlex>
                    {children}
                </TabsFlex>
            </TabsScroller>
        </TabsContainer>
    )
}

const TabsContainer = styled.div`
    -webkit-overflow-scrolling : touch;
    display                    : flex;
    overflow                   : hidden;
    overflow-y                 : auto;
`

const TabsScroller = styled.div`
    position    : relative;
    display     : inline-block;
    flex        : 1 1 auto;
    white-space : nowrap;
    overflow-x  : hidden;
    width       : 100%;
`

const TabsFlex = styled.div`
    display : flex;
`

export const Tab = (props: any) => {
    const { children, selected, ...others } = props
    return (
        <TabButton {...others} selected={selected}>
            {children}
        </TabButton>
    )
}

const TabButton = styled.button<{ selected: boolean }>`
    display                     : inline-flex;
    align-items                 : center;
    justify-content             : center;
    position                    : relative;
    -webkit-tap-highlight-color : transparent;
    background-color            : transparent;
    outline                     : 0;
    border                      : 0;
    margin                      : 0;
    border-radius               : 0;
    padding                     : 0;
    cursor                      : pointer;
    user-select                 : none;
    vertical-align              : middle;
    text-decoration             : none;
    color                       : inherit;
    text-transform              : none;
    font-size                   : 16px;
    box-shadow                  : none;
    font-weight                 : 500;
    font-size                   : 1rem;
    line-height                 : 1;
    letter-spacing              : 0.02857em;
    max-width                   : 360px;
    min-width                   : 90px;
    position                    : relative;
    flex-shrink                 : 0;
    padding                     : 8px 16px;
    overflow                    : hidden;
    white-space                 : normal;
    text-align                  : center;
    color                       : var(--text);
    border-bottom               : 1px solid;
    border-color                : transparent;

    ${props => props.selected && `
        color        : var(--primary);
        border-color : var(--primary);
    `}

    &:hover {
        color        : var(--primary-light);
        border-color : var(--primary-light);
    }
`