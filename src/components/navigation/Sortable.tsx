import React from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Sortable = (props: any) => {
    const { id, draggable, activeId, ...others } = props
    const sortable = useSortable({ id: id, disabled: !draggable });
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition,
    } = sortable;

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? '0.8' : '1',
        border: '1px solid',
        borderColor: isDragging ? 'var(--primary)' : 'transparent',
        borderRadius: 'var(--rounded-sm)'
    };

    return (
        <div
            className='sortable'
            ref={setNodeRef}
            style={style}
            {...{ id, ...others }}
            {...attributes}
            {...listeners}
        >
            {props.children}
        </div>
    )
}

export default Sortable