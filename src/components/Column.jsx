import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ColumnItem from "./ColumnItem";
const Column = ({
  items,
  columnId,
  selectedItems,
  handleItemClick,
  invalidDrop,
}) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`p-2 m-4 transition-all rounded-2xl min-h-12 overflow-y-scroll h-screen w-full ${
            snapshot.isDraggingOver ? "bg-blue-400" : "bg-gray-200"
          }`}
        >
          {items.map((item, index) => (
            <ColumnItem
              key={item.id}
              index={index}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              selectCount={selectedItems.length}
              handleClick={handleItemClick}
              invalidDrop={invalidDrop}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
