import React from 'react'
import styled from 'styled-components'

export const Sidebar = (props: any) => {
    return (
        <SidebarContainer {...props}>
            {props.children}
        </SidebarContainer>
    )
}

const SidebarContainer = styled.div`
    @media (min-width: 1201px) {
        width       : 240px;
        flex-shrink : 0;
    }
`

export const SidebarInner = (props: any) => {
    return (
        <SidebarInnerContainer {...props}>
            {props.children}
        </SidebarInnerContainer>
    )
}

const SidebarInnerContainer = styled.div`
    position                   : fixed;
    top                        : 0;
    left                       : 0;
    width                      : 240px;
    height                     : 100%;
    display                    : flex;
    flex-direction             : column;
    flex-shrink                : 0;
    padding-top                : 64px;
    background-color           : var(--bg-zero);
    color                      : var(--text);
    outline                    : 0;
    overflow-y                 : auto;
    flex                       : 1 0 auto;
    -webkit-overflow-scrolling : touch;
    border-right               : 1px solid var(--light-border);
    z-index                    : 1200;
    transition                 : all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    @media(max-width: 1200px) {
        left   : -100%;
        top    : 64px;
        height : calc(100% - 64px);

        &.active {
            left : 0;
        }
    }

    @media(max-width: 576px) {
        width  : 100%;
        top    : 56px;
        height : calc(100% - 56px);
    }

    h4 {
        padding : 10px 16px 0;
        margin  : 0;
    }
`

export const SidebarList = (props: any) => {
    return (
        <SidebarListContainer {...props}>
            {props.children}
        </SidebarListContainer>
    )
}

const SidebarListContainer = styled.div`
    list-style     : none;
    margin         : 0;
    padding        : 0;
    position       : relative;
    padding-top    : 8px;
    padding-bottom : 8px;
`

export const SidebarItem = (props: any) => {
    return (
        <SidebarListItem {...props}>
            {props.children}
        </SidebarListItem>
    )
}

const SidebarListItem = styled.div`
    display         : flex;
    justify-content : flex-start;
    align-items     : center;
    position        : relative;
    text-decoration : none;
    width           : 100%;
    box-sizing      : border-box;
    text-align      : left;
    padding         : 8px 16px;

    &.active,
    &:hover {
        background-color: var(--bg-one);

        svg {
            color : var(--primary-light);
        }
    }

    .svg-container {
        min-width   : 40px;
        flex-shrink : 0;
        display     : inline-flex;
    }

    svg {
        width  : 1.2rem;
        height : 1.2rem;
    }

    .text {
        flex          : 1 1 auto;
        min-width     : 0;
        margin-top    : 4px;
        margin-bottom : 4px;
    }
`