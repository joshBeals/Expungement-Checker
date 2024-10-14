import React, { useState } from 'react';
import { Trash } from "react-bootstrap-icons";
import { Card, Row, Col, Alert, Badge, Button } from "react-bootstrap";
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
import { useAppState } from '../../store/AppStateContext';
import capitalizeFirst from '../../helpers/capitalizeFirst';

// Sortable item component
function SortableItem({ id, content, draggable }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...(draggable ? listeners : {})}>
            {content}
        </div>
    );
}

const DraggableList = () => {

    const { u_scenarios, reorderUScenarios, deleteUScenario } = useAppState();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        // If `over` is null (item dragged outside the list), exit early
        if (!over) {
            return;
        }
    
        // Only proceed if `active` and `over` elements are different
        if (active.id !== over.id) {
            const oldIndex = u_scenarios.findIndex(item => item.id === active.id);
            const newIndex = u_scenarios.findIndex(item => item.id === over.id);
    
            // Ensure both oldIndex and newIndex exist in the array
            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(u_scenarios, oldIndex, newIndex);
                reorderUScenarios(newOrder); // Update the global state with the new order
            }
        }
    };    

    return (
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={u_scenarios.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div style={{ listStyleType: 'none', padding: 0 }}>
                {u_scenarios.map((item, idx) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        draggable={item?.yearType ? false : true}
                        content={(
                            <>
                                <Alert
                                    variant={item?.yearType ? "light" : "primary"}
                                    className="mb-4 p-3"
                                >
                                    <Alert.Heading>
                                        <Row>
                                            <Col>{item?.type || 'Conviction'}</Col>
                                            <Col className="text-end">{item?.year || `${item.startYear} - ${item.endYear}`}</Col>
                                        </Row>
                                    </Alert.Heading>
                                    <p>Question: {item?.question ? `${capitalizeFirst(item?.question)}?` : '??'}</p>
                                    <hr/>
                                    <div className="mb-0">
                                        {(() => {
                                            const labels = [
                                                item?.tenner && "TenYearFelony",
                                                item?.assaultive && "Assaultive",
                                                item?.owi && "OWI"
                                            ].filter(Boolean);

                                            return (
                                                <Row>
                                                    <Col>
                                                        {labels?.map((label, index) => (
                                                        <Badge bg="secondary" style={{marginRight: '5px'}} key={index}>{label}</Badge>
                                                        ))}
                                                    </Col>
                                                    <Col className="text-end">
                                                        <Trash
                                                            onClick={() => deleteUScenario(idx)}
                                                            className="text-danger"
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    </Col>
                                                </Row>
                                            );
                                        })()}
                                    </div>
                                </Alert>
                            </>
                        )}
                    />
                ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableList;
