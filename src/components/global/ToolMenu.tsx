import React from 'react'
import styled from 'styled-components';
import * as PopperJS from '@popperjs/core';
import { usePopper } from "react-popper";
import useClickOutside from './hooks/useClickOutside';
import useMediaQuery from './hooks/useMediaQuery';
import { useLongPress } from './hooks/useLongPress';
import { addActive } from '@/functions/utils';
import { MoreHoriz, MoreVert } from '@mui/icons-material';

const ToolsMenu = (props: any) => {
    const { className, btnClassName, disabled, onClick, placement, mobile, mobileFull } = props

    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement | null>(null)

    useClickOutside(ref, () => setOpen(false))
    const xs = useMediaQuery('(max-width: 576px)')

    const popperElRef = React.useRef(null);
    const [targetElement, setTargetElement] = React.useState<Element | PopperJS.VirtualElement | null>(null);
    const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(popperElRef.current);

    const { styles, attributes } = usePopper(targetElement, popperElement, {
        placement: placement || "left-start",
    })

    React.useEffect(() => {
        if (!mobileFull) {
            if (open)
                setPopperElement(popperElRef.current)
        } else {
            if (!xs)
                if (open)
                    setPopperElement(popperElRef.current)
        }
    }, [open, mobileFull, xs])

    const longPressProps = useLongPress({
        onClick: () => !xs ? setOpen(!open) : {},
        onLongPress: () => xs ? setOpen(true) : {},
    })

    return (
        !mobile ? (
            <Menu ref={ref} className={className} onClick={onClick} style={props.style}>
                <div
                    className={`tools__menu ${addActive(open)}`}
                    onClick={() => setOpen(false)}
                    ref={popperElRef}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    {props.children}
                </div>
                {props.target ? (
                    <div className='target' ref={setTargetElement as any} onClick={() => setOpen(!open)}>
                        {props.target}
                    </div>
                ) : (
                    <button
                        className={`${btnClassName ? "tools__btn " + btnClassName : "tools__btn"} ${addActive(open)}`}
                        ref={setTargetElement as any}
                        disabled={disabled}
                        onClick={() => setOpen(!open)}
                    >
                        {!props.horizontale ? <MoreVert /> : <MoreHoriz />}
                    </button>
                )}
            </Menu>
        ) : (
            !xs ? (
                <Menu ref={ref} className={className} onClick={onClick}>
                    <div
                        className={`tools__menu ${addActive(open)}`}
                        onClick={() => setOpen(false)}
                        ref={popperElRef}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        {props.children}
                    </div>
                    {props.target ? (
                        <div className='target' ref={setTargetElement as any} onClick={() => setOpen(!open)}>
                            {props.target}
                        </div>
                    ) : (
                        <button
                            className={`${btnClassName ? "tools__btn " + btnClassName : "tools__btn"} ${addActive(open)}`}
                            ref={setTargetElement as any}
                            disabled={disabled}
                            onClick={() => setOpen(!open)}
                        >
                            {!props.horizontale ? <MoreVert /> : <MoreHoriz />}
                        </button>
                    )}
                </Menu>
            ) : (
                <Menu
                    ref={ref}
                    className={`${className ? (mobileFull ? "mobile__full " + className : className) : (mobileFull && "mobile__full")}`}
                    onClick={onClick}
                >
                    <div className={`mobile-menu ${addActive(open)}`}>
                        <div className="mobile-menu-tools" onClick={() => setOpen(false)}>
                            {props.children}
                        </div>
                    </div>
                    {props.target ? (
                        <div className='target' onClick={() => setOpen(!open)}>
                            {props.target}
                        </div>
                    ) : (
                        !mobileFull ? (
                            <button
                                className={`${btnClassName ? "tools__btn " + btnClassName : "tools__btn"} ${addActive(open)}`}
                                disabled={disabled}
                                onClick={() => setOpen(!open)}
                            >
                                {!props.horizontale ? <MoreVert /> : <MoreHoriz />}
                            </button>
                        ) : (
                            <button
                                className={`${btnClassName ? "tools__btn " + btnClassName : "tools__btn"}`}
                                disabled={disabled}
                                {...longPressProps}>
                            </button>
                        )
                    )}
                </Menu>
            )
        )
    )
}

export default ToolsMenu

const Menu = styled.div`
    /* height : 34px;
    width  : 34px; */

    .tools__btn {
        display          : flex;
        align-items      : center;
        justify-content  : center;
        height           : 36px;
        width            : 36px;
        background-color : transparent;
        border           : none;
        border-radius    : var(--rounded-full);
        cursor           : pointer;

        &:hover,
        &.active {
            background-color : var(--bg-zero);
        }

        svg {
            height : 1.5rem;
            width  : 1.5rem;
        }

        &:disabled {
            opacity : 0.5;
        }
    }

    .tools__menu {
        position      : absolute;
        right         : 30px;
        background    : var(--bg-zero);
        border        : 1px solid var(--light-border);
        border-radius : var(--rounded-sm);
        box-shadow    : var(--shadow-lg), var(--shadow-relief);
        visibility    : hidden;
        opacity       : 0;
        transition    : visibility .2s, opacity .5s;
        z-index       : 700;

        &.active {
            visibility : visible;
            opacity    : 1;
            transition : visibility .4s, opacity .4s;
        }

        > div,
        > a {
            display     : flex;
            align-items : center;
            min-width   : 220px;
            font-size   : 1rem;
            text-align  : left;
            padding     : 8px 14px;
            color       : var(--text);
            cursor      : pointer;

            svg {
                height       : 1.3rem;
                width        : 1.3rem;
                margin-right : 9px;
                color        : var(--svg-x-light);
            }

            &:hover {
                background-color : var(--bg-one);
                svg {
                    color : var(--primary-light);
                }
            }

            &.red {
                color : var(--red);
                svg {
                    color : var(--red);
                }
            }
        }

        &.mobile__full {
            position : absolute;
            display  : flex;
            width    : 100%;
            top      : 0;
            bottom   : 0;
            left     : 0;
            right    : 0;

            .tools__btn {
                width            : 100%;
                height           : 100%;
                border-radius    : 0;
                background-color : transparent;
                svg {
                    display : none;
                }
                &:hover {
                    background : none;
                }
            }
        }
    }

    .target {
        cursor  : pointer;
    }

    .mobile-menu {
        display          : none;
        position         : fixed;
        min-width        : 100%;
        top              : unset;
        transform        : none;
        bottom           : -100px;
        left             : 0;
        right            : 0 !important;
        background-color : var(--content-light);
        z-index          : 1000;
        border-radius    : var(--rounded-sm) var(--rounded-sm) 0 0;
        box-shadow       : var(--shadow-top);
        visibility       : hidden;
        opacity          : 0;
        transition       : visibility .4s, opacity .4s, bottom .4s;

        &.active {
            visibility : visible;
            opacity    : 1;
            bottom     : 0;
            transition : visibility .4s, opacity .4s, bottom .4s;
        }

        .mobile-menu-tools {
            position         : relative;
            min-width        : 100%;
            top              : unset;
            transform        : none;
            bottom           : 0;
            left             : 0;
            right            : 0 !important;
            padding          : 10px 0;
            border           : none;
            border-radius    : var(--rounded-sm) var(--rounded-sm) 0 0;
            background-color : var(--content);

            div,
            a {
                display       : flex;
                align-items   : center;
                min-width     : 220px;
                text-align    : left;
                padding       : 8px 20px;
                color         : var(--text);
                cursor        : pointer;

                svg {
                    height       : 16px;
                    width        : 16px;
                    margin-right : 9px;
                    color        : var(--svg-x-light);
                }

                &:hover {
                    background-color : var(--content-light);
                    svg {
                        color : var(--primary);
                    }
                }
            }
        }
    }

    @media(max-width: 576px) {
        .mobile-menu {
            display : block;
        }
    }
`