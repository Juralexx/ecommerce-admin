import React from 'react'
import styled from 'styled-components'
import { CloudUpload } from '@mui/icons-material'

interface Props {
    onClick?: () => void
}

const FakeDropzone = ({ onClick }: Props) => {
    return (
        <Dropzone onClick={onClick}>
            <div className='svg-container'>
                <CloudUpload />
            </div>
            <div className='dropzone-text'>
                Cliquez pour selectionner ou ajouter une image.<br />
                <span>Format acceptés : JPG, PNG, inférieurs à 2 Mo.</span>
            </div>
        </Dropzone>
    )
}

export default FakeDropzone

const Dropzone = styled.div`
    position        : relative;
    display         : flex;
    flex-direction  : column;
    align-items     : center;
    justify-content : center;
    height          : 100%;
    width           : 100%;
    padding         : 35px;
    background      : repeating-conic-gradient(rgb(var(--bg-two-rgb)) 0%, rgb(var(--bg-two-rgb)) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
    border-radius   : var(--rounded-sm);
    border          : 1px solid;
    border-color    : transparent;
    cursor          : pointer;

    &.active,
    &:hover {
        border-color : var(--primary);
        background   : repeating-conic-gradient(rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.2) 25%, transparent 0%, transparent 50%) 50% center / 20px 20px;
    }

    .svg-container {
        width            : 60px;
        height           : 60px;
        padding          : 12px;
        background-color : var(--bg-two);
        border           : 1px solid var(--light-border);
        border-radius    : var(--rounded-full);
        box-shadow       : var(--shadow-sm), var(--shadow-relief);
        margin-bottom    : 10px;
    }

    svg {
        width  : 100%;
        height : 100%;
    }

    .dropzone-text {
        text-align       : center;
        padding          : 15px;
        font-size        : 15px;
        color            : var(--text);
        background-color : var(--bg-two);
        border-radius    : var(--rounded-sm);
        box-shadow       : var(--shadow-sm), var(--shadow-relief);
    }
`