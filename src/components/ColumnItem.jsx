import React from "react";
import { Draggable } from "react-beautiful-dnd";

const ColumnItem = React.memo(({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`select-none p-4 mb-2  ${
            snapshot.isDragging ? "bg-red-400" : "bg-gray-400"
          }  transition-all rounded-2xl`}
          onClick={() => console.log(provided.draggableProps.style)}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
});

export default ColumnItem;
