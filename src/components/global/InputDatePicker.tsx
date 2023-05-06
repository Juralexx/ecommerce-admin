import React from 'react'
import { DayPicker, useInput } from 'react-day-picker'
import 'react-day-picker/dist/style.css';
import fr from 'date-fns/locale/fr';
import styled from 'styled-components'
import useClickOutside from './hooks/useClickOutside';
import Input from './Input';
import InputCard from './InputCard';

const InputDatePicker = (props: any) => {
    const { card, selected, onSelect, mode = 'single', fromDate, ...others } = props

    const [open, setOpen] = React.useState<boolean>(false)

    const ref: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)

    useClickOutside(ref, () => setOpen(false))

    const { dayPickerProps } = useInput({
        fromYear: 2010,
        toYear: 2030,
        fromDate: fromDate,
        format: 'dd/mm/yyyy',
        required: true
    })

    const Element: JSX.Element = card ? (
        <InputCard {...others} readOnly onClick={() => setOpen(!open)} />
    ) : (
        <Input {...others} readOnly onClick={() => setOpen(!open)} />
    )

    return (
        <React.Fragment>
            {Element}
            {open && (
                <DatePickerWrapper className='datepicker-wrapper'>
                    <DatePickerComponent className="datepicker" ref={ref}>
                        <DayPicker
                            {...dayPickerProps}
                            mode={mode}
                            selected={selected}
                            onSelect={mode === 'range' ? (date: any) => onSelect(date) : (dates: any) => {
                                onSelect(dates)
                                setOpen(false)
                            }}
                            locale={fr}
                            modifiersClassNames={{
                                selected: 'selected',
                                today: 'today'
                            }}
                        />
                    </DatePickerComponent>
                </DatePickerWrapper>
            )}
        </React.Fragment>
    )
}

export default InputDatePicker

const DatePickerComponent = styled.div`
    position      : absolute;
    background    : var(--bg-zero);
    border-radius : var(--rounded-sm);
    z-index       : 700;
    box-shadow : var(--shadow-md), var(--shadow-relief);

    .rdp {
        .selected {
            background-color : var(--primary);
            color            : var(--text);
            border-radius    : 5px;
            border           : none;
            outline          : none;
        }

        .today {
            background-color : var(--bg-two);
            border-radius    : var(--rounded-sm);
        }

        .rdp-button {
            border-radius    : var(--rounded-sm);
            &:hover {
                background-color : var(--primary);
                border           : none;
                color            : var(--text);
            }
        }

        .rdp-caption_label {
            margin  : 0;
            padding : 5px;
        }

        .rdp-nav {
            display : flex;

            .rdp-nav_button_previous, .rdp-nav_button_next {
                display       : flex;
                align-items   : center;
                background    : var(--bg-two);
                margin        : 0 3px;
                transform     : scale(1);

                svg {
                    bottom : unset;
                    right  : unset;
                }

                &:hover {
                    background-color : rgba(var(--primary-rgb), 0.8);
                    svg {
                        color : var(--white);
                    }
                }

                &:active {
                    transform  : scale(0.9);
                    box-shadow : none;
                }
            }
        }

        h2 {
            &:before, &:after {
                content : none;
                display : none;
            }
        }
    }
`

const DatePickerWrapper = styled.div`
    position        : fixed;
    top             : 0;
    right           : 0;
    bottom          : 0;
    left            : 0;
    overflow-x      : hidden;
    overflow-y      : auto;
    visibility      : visible;
    z-index         : 100000000000;
    display         : flex;
    align-items     : center;

    .datepicker {
        top       : 50%;
        left      : 50%;
        transform : translate(-50%, -50%);
        z-index   : 1000000000000;
    }
`