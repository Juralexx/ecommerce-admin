import { UnfoldMore } from '@mui/icons-material'
import React from 'react'
import styled from 'styled-components'

interface Props {
    thead?: any[] | null,
    children: React.ReactNode
    [key: string]: any;
}

export const Table = (props: Props) => {
    const { thead, children, ...others } = props
    return (
        <Container>
            <TableContainer {...others}>
                {thead &&
                    <>
                        <TableHead>
                            {thead &&
                                thead.map((el: any, i: number) => {
                                    return (
                                        !el?.action ? (
                                            <TableCell key={i}>
                                                {el}
                                            </TableCell>
                                        ) : (
                                            <TableCell key={i} className="th action" onClick={el.action}>
                                                {el.label} <UnfoldMore />
                                            </TableCell>
                                        )
                                    )
                                })}
                        </TableHead>
                        <TableBody>
                            {children}
                        </TableBody>
                    </>
                }
                {!thead && children}
            </TableContainer>
        </Container>
    )
}

const Container = styled.div`
    background-color : var(--bg-zero);
    color            : var(--text);
    border-radius    : var(--rounded-sm);
    width            : 100%;
    max-width        : 100%;
    overflow-x       : auto;
`

const TableContainer = styled.div`
    display         : table;
    width           : 100%;
    border-collapse : collapse;
    border-spacing  : 0;
    max-width       : 100%;

    @media(max-width: 992px) {
        min-width : 100%;
    }
`

export const TableHead = ({ children }: Props) => {
    return (
        <TableHeadContainer>
            <TableHeadRow>
                {children}
            </TableHeadRow>
        </TableHeadContainer>
    )
}

const TableHeadContainer = styled.div`
    display          : table-header-group;
    border           : 1px solid;
    background-color : var(--bg-zero);
`

const TableHeadRow = styled.div`
    color          : inherit;
    display        : table-row;
    vertical-align : middle;
    outline        : 0;
    border         : 1px solid;
    border-color   : var(--light-border);
    font-weight    : 600;
    font-size      : 1rem; // 0.6875rem;
    line-height    : 1.5;
    color          : rgb(165, 165, 186);
    
    th {
        font-weight : 700;
    }
`

export const TableBody = ({ children }: Props) => {
    return (
        <TableBodyContainer>
            {children}
        </TableBodyContainer>
    )
}

const TableBodyContainer = styled.div`
    display: table-row-group;
`

export const TableRow = ({ children }: Props) => {
    return (
        <TableRowContainer>
            {children}
        </TableRowContainer>
    )
}

const TableRowContainer = styled.div`
    color            : inherit;
    display          : table-row;
    vertical-align   : middle;
    outline          : 0;
    border           : 1px solid;
    border-color     : var(--light-border);
    background-color : var(--bg-one);

    &:nth-child(even) {
        background-color : var(--bg-two);
    }
`

export const TableCell = (props: any) => {
    const { children, ...others } = props
    return (
        <TableCellContainer {...others}>
            {children}
        </TableCellContainer>
    )
}

const TableCellContainer = styled.div<{ ellipsis: number }>`
    table-layout       : fixed;
    display            : table-cell;
    color              : var(--text);
    text-align         : left;
    font-weight        : 400;
    font-size          : 1rem;
    line-height        : 1.43;
    letter-spacing     : 0.01071em;
    vertical-align     : inherit;
    padding            : 10px 16px;
    border             : none;
    overflow           : hidden;
    text-overflow      : ellipsis;
    -webkit-box-orient : vertical;
    -webkit-line-clamp : 6;
    white-space        : nowrap;

    p {
        display            : -webkit-box;
        overflow           : hidden;
        text-overflow      : ellipsis;
        -webkit-box-orient : vertical;
        -webkit-line-clamp : 6;
    }

    .editor-content {
        > *:not(div, p, span, a, b, i, em, small, strong) {
            display     : none;
        }
    }

    &.call-to-action {
        text-align : right;

        > div,
        > button {
            display : inline-block;
        }
    }

    &.action {
        cursor : pointer;

        svg {
            margin-left   : 10px;
            margin-bottom : -5px;
            width         : 18px;
            height        : 18px;
        }

        &:hover {
            background : var(--bg-one);
        }
    }

    &.th {
        padding : 16px;
    }
`