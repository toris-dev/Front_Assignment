import React from "react";
import { Draggable } from "react-beautiful-dnd";

const ColumnItem = React.memo(({ item, index }) => {
  console.log(item.isDragging);
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`select-none p-4 mb-2  
            ${
              snapshot.isDragging ? "bg-blue-600" : "bg-gray-400"
            }  transition-all rounded-2xl  ${
            item.isDragging && item.isInvalidDrop ? "bg-red-900" : ""
          }`}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
});

export default ColumnItem;
