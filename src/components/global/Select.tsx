import React from 'react'
import styled from 'styled-components'
import Input from './Input'
import { ArrowDropDown } from '@mui/icons-material'

const Select = (props: any) => {
    const { style, children, ...others } = props

    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <SelectContainer onClick={() => setOpen(!open)} className={'select-container'}>
            <Input
                {...others}
                endIcon={<ArrowDropDown />}
            />
            <SelectionListContainer className={open ? 'open' : 'closed'}>
                <SelectionList>
                    {children}
                </SelectionList>
            </SelectionListContainer>
        </SelectContainer>
    )
}

export default Select

const SelectContainer = styled.div`
    position  : relative;
    z-index   : 100;
    min-width : 200px;

    .input-container {
        padding-right : 8px;
    }
`

const SelectionListContainer = styled.div`
    border-radius    : var(--rounded-sm);
    position         : absolute;
    top              : 105%;
    overflow-y       : auto;
    overflow-x       : hidden;
    min-width        : 100%;
    height           : auto;
    max-height       : 300px;
    max-width        : calc(100% - 32px);
    outline          : 0;
    background-color : var(--bg-two);
    color            : var(--text);
    box-shadow       : 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    opacity          : 0;
    visibility       : hidden;

    &.open {
        opacity    : 1;
        visibility : visible;
        transition : opacity 384ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 256ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
`

const SelectionList = styled.div`
    list-style       : none;
    margin           : 0;
    padding          : 0;
    position         : relative;
    display          : block;
    padding-top      : 8px;
    padding-bottom   : 8px;
    outline          : 0;
    cursor           : pointer;

    > div {
        padding : 8px 16px;

        &:hover {
            background-color : var(--bg-zero);
        }
    }
`