import React from 'react'
import Image from 'next/image';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Close, Panorama, CloudUpload } from '@mui/icons-material';

import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import Sortable from './Sortable';
import { deleteItemFromArray } from '@/functions/utils';
import { IconButton } from '../global';

interface Props {
    datas: any,
    setDatas: React.Dispatch<React.SetStateAction<any>>,
    error: any,
    setError: React.Dispatch<React.SetStateAction<any>>
}

const getDropzoneImg = (image: any) => {
    if (image && image?.path?.includes('/')) {
        return `${process.env.SERVER_URL}${image.path}`
    } else {
        return URL.createObjectURL(image)
    }
}

export const PicturesDropzone = ({ datas, setDatas, error, setError }: Props) => {
    const MAX_FILES = 6
    const MAX_SIZE = 2000000

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        maxFiles: MAX_FILES,
        maxSize: MAX_SIZE,
        disabled: datas.images.length >= MAX_FILES,
        onDrop: files => {
            if (files.length > 0) {
                const array = [...datas.images, ...files]
                array.forEach((file, i) => Object.assign(file, { id: i + 1 }))
            }
            setDatas((data: any) => ({ ...data, images: [...data.images, ...files] }))
        },
        onDropAccepted: () => {
            if (error)
                setError({ error: '', message: '' })
        },
        onDropRejected: (filesRejected) => {
            if (filesRejected.length > 0) {
                let err: string[] = []

                filesRejected.map(file => {
                    if (file.errors) {
                        for (let i = 0; i < file.errors.length; i++) {
                            if (file.errors[i].code === 'too-many-files') {
                                setError({ error: 'maxSize', message: 'Un seul fichier accepté.' })
                            } else {
                                if (file.errors[i].code === 'file-too-large') {
                                    err = [...err, `Le fichier ${file.file.name} à été refusé pour la raison suivante : Fichier trop lourd.`]
                                }
                                if (file.errors[i].code === 'file-invalid-type') {
                                    err = [...err, `Le fichier ${file.file.name} à été refusé pour la raison suivante : Format invalide.`]
                                }
                            }
                            if (i === file.errors.length - 1) {
                                setError({ error: 'maxSize', message: err.join('\n') })
                            }
                        }
                    }
                })
            }
        },
        onError: () => setError({ error: 'maxSize', message: 'Une erreur est survenue.' })
    })

    const [activeId, setActiveId] = React.useState<number | null>(null);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const arr = [...datas.images]
            const array = arrayMove(arr, active.id - 1, over.id - 1)
            setDatas((datas: any) => ({ ...datas, images: array }))

            setActiveId(null);
        }
    }

    return (
        <DropzoneContainer>
            <Dropzone {...getRootProps({ className: `${isDragActive && "active"}` })}>
                <input {...getInputProps()} name="files" />
                <div className='svg-container'>
                    <CloudUpload />
                </div>
                <div className='dropzone-text'>
                    Déposez vos images ici ou sélectionnez-les.<br />
                    <span>Format acceptés : JPG, PNG, inférieurs à 2 Mo.</span>
                </div>
            </Dropzone>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragMove={(event: any) => setActiveId(event.active.id - 1)}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <SortableContext items={datas.images} strategy={rectSortingStrategy}>
                    <Grid>
                        {[...Array(MAX_FILES)].map((_, i) => {
                            return (
                                <div key={i} style={{ position: 'relative' }}>
                                    {datas.images.length > i ? (
                                        <>
                                            <Sortable id={i + 1} index={i + 1}>
                                                <Image
                                                    src={getDropzoneImg(datas.images[i])}
                                                    height={140}
                                                    width={300}
                                                    alt={datas.name || 'dropzone'}
                                                    style={{ opacity: activeId === i ? 0.5 : 1 }}
                                                />
                                            </Sortable>
                                            {!activeId &&
                                                <Stack>
                                                    <IconButton
                                                        onClick={() => setDatas((datas: any) => ({ ...datas, images: deleteItemFromArray(datas.images, i) }))}
                                                    >
                                                        <Close style={{ color: 'var(--danger)' }} />
                                                    </IconButton>
                                                </Stack>
                                            }
                                            {activeId === i && (
                                                <DragOverlay adjustScale={true}>
                                                    <Image
                                                        src={getDropzoneImg(datas.images[activeId])}
                                                        height={140}
                                                        width={300}
                                                        alt={datas.name || 'dropzone'}
                                                    />
                                                </DragOverlay>
                                            )}
                                        </>
                                    ) : (
                                        <ImagePreview>
                                            <div className='svg-container'>
                                                <Panorama />
                                            </div>
                                        </ImagePreview>
                                    )}
                                </div>
                            )
                        })}
                    </Grid>
                </SortableContext>
            </DndContext>
        </DropzoneContainer>
    )
}

const DropzoneContainer = styled.div`
    display        : flex;
    flex-direction : column;
    align-items    : center;
`

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

const ImagePreview = styled.div`
    background-color : var(--bg-two);
    width            : 100%;
    height           : 100%;
    min-height       : 200px;
    display          : flex;
    align-items      : center;
    justify-content  : center;
    border-radius    : var(--rounded-sm);

    .svg-container {
        width            : 80px;
        height           : 80px;
        padding          : 15px;
        background-color : var(--bg-one);
        border           : 1px solid var(--light-border);
        border-radius    : var(--rounded-full);
        box-shadow       : var(--shadow-sm), var(--shadow-relief);
    }

    svg {
        width  : 100%;
        height : 100%;
    }
`

const Grid = styled.div`
    display               : grid;
    grid-template-columns : repeat(3, minmax(0, 1fr));
    grid-gap              : 10px;
    width                 : 100%;
    margin-top            : 20px;

    @media(max-width: 768px) {
        grid-template-columns : repeat(2, minmax(0, 1fr));
    }
    @media(max-width: 576px) {
        grid-template-columns : repeat(1, minmax(0, 1fr));
    }

    > div,
    .sortable {
        position   : relative;
        width      : 100%;
        height     : 100%;
        max-height : 250px;
    }

    img {
        display    : block;
        height     : 100%;
        width      : 100%;
        margin     : 0 auto;
        object-fit : cover;
    }
`

const Stack = styled.div`
    display        : flex;
    flex-direction : row;
    align-items    : center;
    position       : absolute;
    right          : 7px;
    top            : 7px;

    > * {
        margin-left : 5px;
    }
`