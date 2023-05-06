import React from 'react'
import styled from 'styled-components'

const AppBar = (props: any) => {
    const { children } = props
    return (
        <AppBarContainer>
            <Toolbar>
                {children}
            </Toolbar>
        </AppBarContainer>
    )
}

export default AppBar

const AppBarContainer = styled.div`
    display          : flex;
    flex-direction   : column;
    width            : 100%;
    box-sizing       : border-box;
    flex-shrink      : 0;
    position         : fixed;
    top              : 0;
    left             : auto;
    right            : 0;
    color            : var(--text);
    background-color : transparent;
    box-shadow       : none;
    z-index          : 1100;
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    @media(min-width: 1201px) {
        width       : calc(100% - 240px);
        margin-left : 240px;
    }
`

const Toolbar = styled.div`
    position         : relative;
    display          : flex;
    align-items      : center;
    justify-content  : space-between;
    padding-left     : 10px;
    padding-right    : 5px;
    min-height       : 56px;
    background-color : var(--bg-zero);

    @media (min-width: 577px) {
        padding-left  : 24px;
        padding-right : 24px;
        min-height    : 64px;
    }
`