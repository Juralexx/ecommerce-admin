import React from 'react'
import styled, { css } from 'styled-components'

export const Card = (props: any) => {
    const { children, ...others } = props

    return (
        <CardContainer {...others}>
            {children}
        </CardContainer>
    )
}

const CardContainer = styled.div`
    position         : relative;
    background-color : var(--bg-zero);
    color            : var(--text);
    box-shadow       : none;
    border-radius    : var(--rounded-sm);
    border           : 1px solid;
    border-color     : var(--light-border);
    transition       : box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`

export const CardHeader = (props: any) => {
    const { children, avatar, title, subtitle, action, ...others } = props

    return (
        <CardHeaderContainer {...others}>
            {avatar &&
                <CardHeaderAvatar>
                    {avatar}
                </CardHeaderAvatar>
            }
            {(title || subtitle || action) &&
                <CardHeaderContent>
                    {title &&
                        <div className='title'>
                            {title}
                        </div>
                    }
                    {subtitle &&
                        <div className='subtitle'>
                            {subtitle}
                        </div>
                    }
                </CardHeaderContent>
            }
            {action &&
                <CardHeaderAction>
                    <div className='action'>
                        {action}
                    </div>
                </CardHeaderAction>
            }
            {children}
        </CardHeaderContainer>
    )
}

const CardHeaderContainer = styled.div`
    display     : flex;
    align-items : center;
    padding     : 16px;
`

const CardHeaderAvatar = styled.div`
    display      : flex;
    flex         : 0 0 auto;
    margin-right : 16px;
`

const CardHeaderContent = styled.div`
    flex : 1 1 auto;

    .title,
    .subtitle {
        display            : block;
        margin             : 0;
        overflow           : hidden;
        text-overflow      : ellipsis;
        display            : -webkit-box;
        -webkit-line-clamp : 1;
        -webkit-box-orient : vertical;
    }

    .title {
        font-size      : 18px;
        line-height    : 1.5;
        font-weight    : 400;
        letter-spacing : 0.01071em;
        color          : var(--text);
    }

    .subtitle {
        font-weight    : 400;
        font-size      : 0.875rem;
        line-height    : 1.43;
        letter-spacing : 0.01071em;
        color          : var(--text-secondary);
    }
`

const CardHeaderAction = styled.div`
    flex          : 0 0 auto;
    align-self    : flex-start;
    margin-top    : -4px;
    margin-right  : -8px;
    margin-left   : 5px;
    margin-bottom : -4px;
`

export const CardContent = (props: any) => {
    const { children, ...others } = props

    return (
        <CardContentContainer {...others}>
            {children}
        </CardContentContainer>
    )
}

const CardContentContainer = styled.div<{ ellipsis: number, small: boolean }>`
    position : relative;
    padding  : 16px;

    > div,
    > p {
        ${({ ellipsis }) => ellipsis && css`
            overflow           : hidden;
            text-overflow      : ellipsis;
            display            : -webkit-box;
            -webkit-box-orient : vertical;
            -webkit-line-clamp : ${({ ellipsis }: any) => ellipsis && ellipsis};
        `};
    };

    ${({ small }) => small && css`
        padding   : 10px;

        > p,
        > div {
            font-size : 0.8rem;
        }
    `};
`