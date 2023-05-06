import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { addActive, addClass } from '../../functions/utils'
import { East, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, West } from '@mui/icons-material'

export const MiddlePagination = (props: any) => {
    const { array, baseRoute, currentPage, count, limit } = props

    return (
        array &&
        <MiddlePaginationContainer>
            <div className="pagination">
                {currentPage - 1 > 0 &&
                    <React.Fragment>
                        <Link href={`${baseRoute}`} className='arrow' passHref>
                            <KeyboardDoubleArrowLeft />
                        </Link>
                        <Link href={`${baseRoute}/?p=${currentPage - 1}`} className='arrow' passHref>
                            <KeyboardArrowLeft />
                        </Link>
                    </React.Fragment>
                }
                {[...new Array(Math.ceil(count / limit))].map((_, key) => {
                    return (
                        <Link href={`${baseRoute}/?p=${key + 1}`}
                            key={key}
                            className={`${addClass(currentPage > (key + 3) || currentPage < (key - 1), 'hidden')} ${addActive(currentPage === (key + 1))}`}
                        >
                            {key + 1}
                        </Link>
                    )
                })}
                {currentPage + 1 <= array.length &&
                    <React.Fragment>
                        <Link href={`${baseRoute}/?p=${currentPage + 1}`} className='arrow' passHref>
                            <KeyboardArrowRight />
                        </Link>
                        <Link href={`${baseRoute}/?p=${array.length}`} className='arrow' passHref>
                            <KeyboardDoubleArrowRight />
                        </Link>
                    </React.Fragment>
                }
            </div>
        </MiddlePaginationContainer>
    )
}

const MiddlePaginationContainer = styled.div`
    display         : flex;
    align-items     : center;
    justify-content : center;
    padding         : 30px 0;

    .pagination {
        display : inline-block;

        a {
            display         : flex;
            align-items     : center;
            justify-content : center;
            height          : 36px;
            width           : 36px;
            margin          : 0 2px;
            color           : var(--text);
            float           : left;
            border-radius   : var(--rounded-md);

            &.active {
                background-color : rgba(var(--primary-rgb), 0.2);
                color            : var(--primary);
                font-weight      : 500;
            }

            &.hidden {
                display : none;
            }

            &.arrow {
                width : 28px;
                svg {
                    height : 22px;
                    width  : 22px;
                }
            }

            &:hover {
                &:not(.active):not(.arrow) {
                    background-color : rgba(var(--primary-rgb), 0.2);
                    color            : var(--primary);
                }
                &.arrow {
                    svg {
                        color : var(--primary);
                    }
                }
            }
        }
    }
`

export const SidePagination = (props: any) => {
    const { array, router, currentPage, count, limit } = props

    return (
        array &&
        <SidePaginationContainer>
            <div className="pagination">
                <div className="pagination-right">
                    {count > 0 && (((currentPage - 1) * limit) + 1) + ' ⎯ ' + (Math.min(currentPage * limit, count)) + ' sur '} {count} résultats
                </div>
                <div className="pagination-right">
                    <div className='count'>
                        {currentPage} sur {Math.ceil(count / limit)}
                    </div>
                    <Link
                        href={{ pathname: currentPage <= 2 ? router.pathname : `${router.pathname}`, query: { ...router.query, p: currentPage - 1 } }}
                        passHref
                        className={currentPage <= 1 ? 'disabled' : ''}
                    >
                        <West />
                    </Link>
                    <Link
                        href={{ pathname: currentPage < Math.ceil(count / limit) ? `${router.pathname}` : '', query: { ...router.query, p: currentPage + 1 } }}
                        passHref
                        className={currentPage < Math.ceil(count / limit) ? '' : 'disabled'}
                    >
                        <East />
                    </Link>
                </div>
            </div>
        </SidePaginationContainer>
    )
}

const SidePaginationContainer = styled.div`
    display         : flex;
    align-items     : center;
    justify-content : center;
    padding         : 30px 0;

    .pagination {
        display         : inline-flex;
        align-items     : center;
        justify-content : space-between;
        width           : 100%;

        .pagination-right {
            display     : flex;
            align-items : center;
        }

        .count {
            margin-right : 10px;
        }

        a {
            display         : flex;
            align-items     : center;
            justify-content : center;
            height          : 36px;
            width           : 36px;
            margin          : 0 2px;
            color           : var(--text);
            float           : left;
            border-radius   : var(--rounded-full);
        
            svg {
                height  : 28px;
                width   : 28px;
                padding : 5px;
            }

            &:hover {
                background-color : var(--bg-two);
                color            : var(--primary);
            }

            &.disabled {
                pointer-events : none;
            }
        }
    }
`