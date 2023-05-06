import React from 'react'
import styled from 'styled-components'

interface Props {
    children: React.ReactNode;
    control: React.ReactNode;
    [key: string]: any;
}

const FormControlLabel = (props: Props) => {
    const { children, control, ...others } = props
    return (
        <LabelContainer {...others}>
            <CheckboxContainer>
                {props.control}
            </CheckboxContainer>
            <LabelTextContainer>
                {props.children}
            </LabelTextContainer>
        </LabelContainer>
    )
}

export default FormControlLabel

const LabelContainer = styled.label`
    display                     : inline-flex;
    align-items                 : center;
    cursor                      : pointer;
    vertical-align              : middle;
    -webkit-tap-highlight-color : transparent;
    margin-left                 : -11px;
    margin-right                : 16px;
`

const CheckboxContainer = styled.div`
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
    font-size                   : 1rem;
    box-shadow                  : none;
    border-radius               : 50%;
`

const LabelTextContainer = styled.div`
    margin         : 0;
    font-weight    : 400;
    font-size      : 1rem;
    line-height    : 1;
    letter-spacing : 0.00938em;
    color          : var(--text);
    margin-left    : 10px;
`