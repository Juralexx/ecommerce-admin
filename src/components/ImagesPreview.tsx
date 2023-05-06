import React from 'react'
import Image from 'next/image';
import styled from 'styled-components';
import { Close, Panorama } from '@mui/icons-material';

import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { IconButton } from './global';
import dynamic from 'next/dynamic';

const Sortable = dynamic(() => import('@/components/dropzones/Sortable'), {
    ssr: false,
});

const getImgPath = (image: any) => {
    if (image && image?.path?.includes('/')) {
        return `${process.env.SERVER_URL}${image.path}`
    } else {
        return URL.createObjectURL(image)
    }
}

interface Props {
    images: any[],
    maxFiles: number,
    onDelete: (...arg: any[]) => void,
    onMove: (...arg: any[]) => void
}

const ImagesPreview = ({ images, maxFiles, onDelete, onMove }: Props) => {
    const MAX_FILES = maxFiles || 6
    const [activeId, setActiveId] = React.useState<number | null>(null);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const arr = [...images]
            const array = arrayMove(arr, active.id - 1, over.id - 1)
            onMove(array)

            setActiveId(null);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragMove={(event: any) => setActiveId(event.active.id - 1)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
        >
            <SortableContext items={images} strategy={rectSortingStrategy}>
                <Grid>
                    {[...Array(MAX_FILES)].map((_, i) => {
                        return (
                            <div key={i} style={{ position: 'relative' }}>
                                {images.length > i ? (
                                    <>
                                        <Sortable id={i + 1} index={i + 1}>
                                            <Image
                                                src={getImgPath(images[i])}
                                                height={140}
                                                width={300}
                                                alt={'Image preview'}
                                                style={{ opacity: activeId === i ? 0.5 : 1 }}
                                            />
                                        </Sortable>
                                        {!activeId &&
                                            <Stack>
                                                <IconButton small onClick={() => onDelete(i)}>
                                                    <Close />
                                                </IconButton>
                                            </Stack>
                                        }
                                        {activeId === i && (
                                            <DragOverlay adjustScale={true}>
                                                <Image
                                                    src={getImgPath(images[activeId])}
                                                    height={140}
                                                    width={300}
                                                    alt={'Image preview'}
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
    )
}

export default ImagesPreview

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