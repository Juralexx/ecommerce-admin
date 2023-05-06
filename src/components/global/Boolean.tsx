import React from 'react'
import styled from 'styled-components'

export const addClass = (state: boolean, classe: string) => {
    if (state) return classe
    else return 'un' + classe
}

interface Props {
    name?: string,
    leftValue?: string | number,
    rightValue?: string | number,
    leftActive?: boolean,
    rightActive?: boolean,
}

const Boolean = (props: Props) => {
    const { name, leftValue, rightValue, leftActive = false, rightActive = true, ...others } = props
    return (
        <Container {...others}>
            {name &&
                <label>{name}</label>
            }
            <label htmlFor='boolean'>
                <BooleanContainer>
                    <BooleanButton className={`false ${addClass(leftActive, 'active')}`}>
                        {leftValue ? leftValue : 'Faux'}
                    </BooleanButton>
                    <BooleanButton className={`true ${addClass(rightActive, 'active')}`}>
                        {rightValue ? rightValue : 'Vrai'}
                    </BooleanButton>
                    <input id="boolean" type="check" aria-disabled="false" aria-required="false" checked={false} />
                </BooleanContainer>
            </label>
        </Container>
    )
}

export default Boolean

const Container = styled.div`
    position : relative;

    label {
        display        : block;
        font-weight    : 400;
        font-size      : 1rem;
        line-height    : 1.5;
        letter-spacing : 0.00938em;
        margin-left    : 4px;
        margin-bottom  : 8px;
        color          : var(--text);
        position       : relative;
        user-select    : none;

        &.error {
            color : var(--danger);
        }
        &.success {
            color : var(--success);
        }
    }

    input {
        position : absolute;
        left     : -999vw;
        opacity  : 0;
    }
`

const BooleanContainer = styled.div`
    background    : var(--bg-zero);
    padding       : 4px;
    border-radius : var(--rounded-sm);
    border-style  : solid;
    border-width  : 1px;
    border-color  : var(--light-border);
    display       : flex;
    overflow      : hidden;
    flex-wrap     : wrap;
    outline       : none;
    transition    : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

    &:focus-within {
        box-shadow : 0 0 0 2px var(--primary);
    }
`

const BooleanButton = styled.div`
    background-color : transparent;
    border           : 1px solid var(--bg-zero);
    position         : relative;
    user-select      : none;
    z-index          : 2;
    flex             : 1 1 50%;
    padding-top      : 6px;
    padding-bottom   : 6px;
    text-align       : center;
    cursor           : pointer;

    &.active {
            background-color : var(--bg-one);
            border           : 1px solid var(--light-border);
        &.true {
            color : var(--primary-light);
        }
        &.false {
            color : var(--danger);
        }
    }
    &:hover {
        &.true {
            color : var(--primary-light);
        }
        &.false {
            color : var(--danger);
        }
    }
`