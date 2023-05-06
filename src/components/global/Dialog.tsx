import React from 'react'
import styled from 'styled-components'
import useClickOutside from './hooks/useClickOutside'
import IconButton from './IconButton'
import { Close } from '@mui/icons-material'

export const Dialog = (props: any) => {
    const { children, open, onClose, mobileFull, tabletFull, ...others } = props
    const wrapper = React.useRef() as any
    useClickOutside(wrapper, () => { if (open) onClose() })

    return (
        <DialogWrapper className={open ? 'open' : 'closed'}>
            <DialogBackdrop />
            <DialogContainer>
                <DialogPaper ref={wrapper} {...{ ...others, mobileFull, tabletFull }}>
                    {children}
                    <CloseContainer>
                        <IconButton small onClick={() => onClose()}>
                            <Close />
                        </IconButton>
                    </CloseContainer>
                </DialogPaper>
            </DialogContainer>
        </DialogWrapper>
    )
}

const DialogWrapper = styled.div`
    position   : fixed;
    z-index    : 1300;
    right      : 0;
    bottom     : 0;
    top        : 0;
    left       : 0;
    opacity    : 0;
    visibility : hidden;
    transition : 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    &.open {
        opacity    : 1;
        visibility : visible;
    }
`

const DialogBackdrop = styled.div`
    position                    : fixed;
    display                     : flex;
    align-items                 : center;
    justify-content             : center;
    right                       : 0;
    bottom                      : 0;
    top                         : 0;
    left                        : 0;
    background-color            : rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color : transparent;
    z-index                     : -1;
`

const DialogContainer = styled.div`
    height          : 100%;
    outline         : 0;
    display         : flex;
    justify-content : center;
    align-items     : center;
`

const DialogPaper = styled.div<{ mobileFull: boolean, tabletFull: boolean }>`
    position         : relative;
    display          : flex;
    flex-direction   : column;
    background-color : var(--bg-zero);
    color            : var(--text);
    box-shadow       : 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
    margin           : 32px;
    overflow-y       : auto;
    width            : 100%;
    max-width        : 768px;
    max-height       : 600px;
    border-radius    : var(--rounded-sm);
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    ${({ mobileFull }) => mobileFull && `
        @media(max-width: 576px) {
            margin        : 0;
            max-height    : 100%;
            border-radius : 0;
        }
    `};
    ${({ tabletFull }) => tabletFull && `
        @media(max-width: 768px) {
            margin        : 0;
            max-height    : 100%;
            border-radius : 0;
        }
    `};
`

const CloseContainer = styled.div`
    position : absolute;
    top      : 10px;
    right    : 10px;
`

export const DialogTitle = (props: any) => {
    const { children, ...others } = props
    return (
        <DialogTitleContainer {...others}>
            {children}
        </DialogTitleContainer>
    )
}

const DialogTitleContainer = styled.div`
    margin           : 0;
    font-weight      : 500;
    font-size        : 1.25rem;
    line-height      : 1.6;
    letter-spacing   : 0.0075em;
    padding          : 12px 24px;
    flex             : 0 0 auto;
`

export const DialogContent = (props: any) => {
    const { children, ...others } = props
    return (
        <DialogContentContainer {...others}>
            {children}
        </DialogContentContainer>
    )
}

const DialogContentContainer = styled.div`
    flex                       : 1 1 auto;
    -webkit-overflow-scrolling : touch;
    overflow-y                 : auto;
    padding                    : 16px 24px;
    background-color           : var(--bg-one);
`

export const DialogActions = (props: any) => {
    const { children, ...others } = props
    return (
        <DialogActionsContainer {...others}>
            {children}
        </DialogActionsContainer>
    )
}

const DialogActionsContainer = styled.div`
    display         : flex;
    align-items     : center;
    padding         : 12px;
    justify-content : flex-end;
    flex            : 0 0 auto;

    > button,
    > div {
        margin-left : 5px;
    }
`