import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import "../../css/scenario.css";

// Sortable item component
function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="timeline" style={style}>
      <div className="timeline-content">
        {content}
      </div>
    </div>
  );
}

const DraggableListNew = () => {
  // Your real data
  const [items, setItems] = useState([
    { id: 1, type: '', yearType: 'single', year: '2013', startYear: '', endYear: '', owi: false, assaultive: false, tenner: false, question: '' },
    { id: 2, type: '', yearType: 'range', year: '', startYear: '2014', endYear: '2016', owi: true, assaultive: false, tenner: false, question: '' },
    { id: 3, type: 'Felony', yearType: 'single', year: '2015', startYear: '', endYear: '', owi: false, assaultive: false, tenner: true, question: '' },
    { id: 4, type: '', yearType: '', year: '', startYear: '', endYear: '', owi: false, assaultive: true, tenner: false, question: '' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="Yearly-timeline">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={(
                <>
                  <h3 className="title">{item.year || `${item.startYear} - ${item.endYear}`}</h3>
                  <p className="description">{item.type || 'Unknown'}</p>
                  <p className="mt-2">
                    {(() => {
                      const labels = [
                      item?.tenner && "TenYearFelony",
                      item?.assaultive && "Assaultive",
                      item?.owi && "OWI"
                      ].filter(Boolean);

                      return labels.length > 0 ? `(${labels.join(", ")})` : '';
                    })()}
                  </p>
                </>
              )}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableListNew;
