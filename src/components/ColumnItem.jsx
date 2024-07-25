import React from "react";
import { Draggable } from "react-beautiful-dnd";

const ColumnItem = React.memo(
  ({ item, index, isSelected, selectCount, handleClick, invalidDrop }) => {
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`select-none p-4 mb-2 relative  
            ${isSelected ? "bg-blue-600" : "bg-gray-400"} 
            transition-all rounded-2xl 
            ${snapshot.isDragging && invalidDrop ? "bg-red-900" : ""}`}
            onClick={(e) => handleClick(item.id, e)}
          >
            {item.content}
            {snapshot.isDragging && (
              <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold py-1 px-2 rounded">
                {selectCount}
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  }
);

export default ColumnItem;
