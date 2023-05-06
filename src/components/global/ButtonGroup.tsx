import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
    children?: React.ReactNode,
    orientation?: string
}

const ButtonGroup = (props: any) => {
    const { children, ...others } = props
    return (
        <ButtonGroupeContainer {...others}>
            {children}
        </ButtonGroupeContainer>
    )
}

export default ButtonGroup

const ButtonGroupeContainer = styled.div<Props>`
    display       : inline-flex;
    border-radius : 4px;

    button {
        display                     : inline-flex;
        align-items                 : center;
        justify-content             : center;
        position                    : relative;
        box-sizing                  : border-box;
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
        font-size                   : 0.875rem;
        line-height                 : 1.75;
        letter-spacing              : 0.02857em;
        text-transform              : uppercase;
        min-width                   : 64px;
        padding                     : 6px 16px;
        border-radius               : 4px;
        transition                  : background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        color                       : #fff;
        background-color            : #4945ff;
        text-transform              : none;
        font-size                   : 16px;
        box-shadow                  : none;
        min-width                   : 40px;

        ${({ orientation }) => !orientation && css`
            &:not(:last-of-type) {
                border-top-right-radius    : 0;
                border-bottom-right-radius : 0;
                border-right               : 1px solid #bdbdbd;
                border-color               : #3933FE;
            }
            &:not(:first-of-type) {
                border-top-left-radius    : 0;
                border-bottom-left-radius : 0;
            }
        `}
    }

    ${({ orientation }) => orientation === 'vertical' && css`
        flex-direction : column;

        button {
            &:not(:last-of-type) {
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
                border-bottom: 1px solid #bdbdbd;
                border-color: #3933FE;
            }
            &:not(:first-of-type) {
                border-top-right-radius: 0;
                border-top-left-radius: 0;
            }
        }
    `}
`