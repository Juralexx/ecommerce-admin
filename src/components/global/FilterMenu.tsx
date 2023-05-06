import React from 'react'
import styled from 'styled-components'
import Button from './Button'
import { addActive } from '@/functions/utils'
import { KeyboardArrowDown, Tune } from '@mui/icons-material'
import Stack from './Stack'
import useClickOutside from './hooks/useClickOutside'

const FilterMenu = (props: any) => {
    const { onValidate, onReset } = props
    const [openFilters, setOpenFilters] = React.useState<boolean>(false)

    const ref: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)
    useClickOutside(ref, () => setOpenFilters(false))

    return (
        <FiltersMenuContainer ref={ref}>
            <Button variant="classic" onClick={() => setOpenFilters(!openFilters)}>
                <Tune /> Filtrer
            </Button>
            <FiltersMenu className={addActive(openFilters)}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    style={{ width: '100%' }}
                    className="content"
                >
                    <Button variant="classic" onClick={() => {
                        onReset()
                        setOpenFilters(false)
                    }}>
                        Réinitialiser
                    </Button>
                    <Button fullWidth onClick={() => {
                        setOpenFilters(false)
                        return onValidate()
                    }}>
                        Appliquer
                    </Button>
                </Stack>
                {props.children}
            </FiltersMenu>
        </FiltersMenuContainer>
    )
}

export default FilterMenu

const FiltersMenuContainer = styled.div`
    position : relative;
    display  : inline-block;
    z-index  : 1;

    button {
        height : 40px;
    }
`

export const FiltersMenu = styled.div`
    position         : absolute;
    top              : 120%;
    left             : -20px;
    border-radius    : var(--rounded-sm);
    background-color : var(--bg-zero);
    border           : 1px solid var(--light-border);
    min-width        : 300px;
    box-shadow       : var(--shadow-lg);
    visibility       : hidden;
    opacity          : 0;
    visibility       : hidden;

    &.active {
        opacity    : 1;
        visibility : visible;
        transition : opacity 384ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 256ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }

    .content {
        padding : 10px 15px;
    }

    > .cells {
        padding    : 15px 15px 15px 25px;
        border-top : 1px solid var(--light-border);

        label {
            width : 100%;
        }

        &:hover {
            background-color : var(--bg-one);
        }
    }
`

export const FilterSubMenu = (props: any) => {
    const { children, name } = props
    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <FilterSubMenuContainer className={addActive(open)}>
            <div className='filter-submenu-header' onClick={() => setOpen(!open)}>
                {name} <KeyboardArrowDown />
            </div>
            <div className='cells-container'>
                {children}
            </div>
        </FilterSubMenuContainer>
    )
}

const FilterSubMenuContainer = styled.div`
    border-top : 1px solid var(--light-border);
    overflow      : hidden;

    .filter-submenu-header {
        height          : 50px;
        width           : 100%;
        padding         : 4px 15px 4px 25px;
        display         : inline-flex;
        align-items     : center;
        justify-content : space-between;
        cursor          : pointer;
        vertical-align  : middle;
        font-weight     : 400;

        &:hover {
            background-color : var(--bg-one);
        }
    }

    .cells-container {
        max-height : 0;
        transition : all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;;
        opacity    : 0;
        visibility : hidden;
    }

    .cells {
        padding : 12px 15px 12px 45px;

        label {
            width : 100%;
        }

        &:hover {
            background-color : var(--bg-one);
        }
    }

    &.active {
        max-height : 500px;
        overflow   : visible;

        .cells-container {
            max-height : 500px;
            opacity    : 1;
            visibility : visible;
        }
    }
`

export const Displayer = styled.div`
    display       : flex;
    align-items   : center;
    width         : 100%;
    height        : 40px;
    padding-top   : 1px;
    background    : transparent;
    overflow      : auto;
    overflow-y    : hidden;
    margin-bottom : 8px;

    &::-webkit-scrollbar {
        height : 4px;
    }

    > div {
        margin-right : 5px;
        cursor       : pointer;
        &:hover {
            background-color : var(--bg-one);
        }
    }

    svg {
        margin-left   : 5px;
        margin-bottom : -1px;
    }
`