import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ColumnItem from "./ColumnItem";

const Column = ({ items, columnId }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${
            snapshot.isDraggingOver ? "bg-blue-400" : "bg-gray-200"
          } p-2 ${
            snapshot.isUsingPlaceholder ? "w-64" : "w-56"
          } min-h-16 transition-all rounded-2xl`}
        >
          {items.map((item, index) => (
            <ColumnItem key={item.id} index={index} item={item} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
