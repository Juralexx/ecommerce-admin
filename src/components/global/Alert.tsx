import React from 'react'
import styled, { css } from 'styled-components'

const Alert = (props: any) => {
    const { type, children, ...others } = props

    return (
        <AlertContainer type={type} {...others}>
            <div className='alert-icon'>
                {type === 'error' &&
                    <ErrorSVG />
                }
                {type === 'success' &&
                    <SuccessSVG />
                }
                {type === 'info' &&
                    <InfoSVG />
                }
                {type === 'warning' &&
                    <WarningSVG />
                }
            </div>
            <div className='alert-content'>
                {children}
            </div>
        </AlertContainer>
    )
}

export default Alert

const AlertContainer = styled.div<{ type: string }>`
    position         : relative;
    display          : flex;
    background-color : #161618;
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius    : var(--rounded-sm);
    box-shadow       : none;
    font-size        : 1rem;
    line-height      : 1.5;
    letter-spacing   : 0.01071em;
    background-color : rgb(253, 237, 237);
    padding          : 6px 16px;
    overflow         : hidden;
    backdrop-filter  : blur(10px);
    transform-style  : preserve-3d;
    margin-top       : 5px;

    ${props => props.type === 'error' && css`
        color            : var(--danger-color);
        background-color : rgba(var(--danger-rgb), 0.5);

        svg {
            color : var(--danger);
        }
    `}
    ${props => props.type === 'success' && css`
        color            : var(--success-color);
        background-color : rgba(var(--success-rgb), 0.5);

        svg {
            color : var(--success);
        }
    `}
    ${props => props.type === 'warning' && css`
        color            : var(--warning-color);
        background-color : rgba(var(--warning-rgb), 0.5);

        svg {
            color : var(--warning);
        }
    `}
    ${props => props.type === 'info' && css`
        color            : var(--info-color);
        background-color : rgba(var(--info-rgb), 0.5);

        svg {
            color : var(--info);
        }
    `}

    /* &:before {
        content          : '';
        position         : absolute;
        left             : 0;
        top              : 0;
        width            : 100%;
        height           : 100%;
        background-color : rgba(255, 255, 255, 0.5);
        transform        : translateZ(-1px);
    } */

    .alert-icon {
        display      : flex;
        margin-right : 12px;
        padding      : 7px 0;
        font-size    : 22px;
        opacity      : 0.9;
    }

    svg {
        user-select : none;
        width       : 1em;
        height      : 1em;
        display     : inline-block;
        fill        : currentColor;
        flex-shrink : 0;
        transition  : fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size   : inherit;
    }

    .alert-content {
        padding   : 8px 0;
        min-width : 0;
        overflow  : auto;
    }
`

const ErrorSVG = () => {
    return (
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorOutlineIcon">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </svg>
    )
}
const SuccessSVG = () => {
    return (
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SuccessOutlinedIcon">
            <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path>
        </svg>
    )
}
const WarningSVG = () => {
    return (
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ReportProblemOutlinedIcon">
            <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path>
        </svg>
    )
}
const InfoSVG = () => {
    return (
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoOutlinedIcon">
            <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path>
        </svg>
    )
}