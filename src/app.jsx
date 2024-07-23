import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./components/Column";

export default function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k + offset).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));

  // 각 컬럼을 개별 상태로 관리
  const [columns, setColumns] = useState({
    col1: { id: "col1", items: getItems(10) },
    col2: { id: "col2", items: getItems(10, 10) },
    col3: { id: "col3", items: getItems(10, 20) },
    col4: { id: "col4", items: getItems(10, 30) },
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newItems = Array.from(column.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: {
          ...column,
          items: newItems,
        },
      }));
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      }));
    }
  };

  return (
    <div className="flex justify-around items-center h-screen overflow-y-scroll">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.values(columns).map((column) => (
          <div className="h-screen overflow-y-scroll w-full flex flex-col justify-center items-center">
            <Column key={column.id} items={column.items} columnId={column.id} />
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
