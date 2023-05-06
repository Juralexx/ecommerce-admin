// import { Radio } from '@mui/material';
import React from 'react'
import styled from 'styled-components'
import Radio from './Radio';

interface Props {
    children: React.ReactNode;
    title?: string;
    checked?: boolean;
    [key: string]: any;
}

const SelectCard = (props: Props) => {
    const { children, title, checked, ...others } = props
    return (
        <SelectCardContainer className={checked ? 'active' : 'unactive'} {...others}>
            <Radio checked={checked} />
            {title &&
                <div className='card-title'>{title}</div>
            }
            {children}
        </SelectCardContainer>
    )
}

export default SelectCard

const SelectCardContainer = styled.div`
    position         : relative;
    background-color : var(--bg-two);
    padding          : 20px 20px 20px 60px;
    border-radius    : var(--rounded-sm);
    border           : 1px solid transparent;
    cursor           : pointer;

    &:hover,
    &.active {
        border : 1px solid var(--primary);
        .radio {
            svg {
                color:var(--primary)
            }
        }
    }

    .radio {
        position  : absolute;
        left      : 10px;
        top       : 10px;
        transform : scale(1.2);
    }

    .card-title {
        font-size : 16px;
    }

    p {
        margin-top : 6px;
        color      : var(--text-secondary);
    }
`