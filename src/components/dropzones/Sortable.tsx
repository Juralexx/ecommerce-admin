import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Sortable = (props: any) => {
    const sortable = useSortable({ id: props.id });
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition,
    } = sortable;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className='sortable'
            ref={setNodeRef}
            style={style}
            {...props}
            {...attributes}
            {...listeners}
        >
            {props.children}
        </div>
    )
}

export default Sortable