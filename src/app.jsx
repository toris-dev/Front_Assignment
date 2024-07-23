import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import Column from "./components/Column";

export default function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k + offset).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));

  const [columns, setColumns] = useState({
    col1: { id: "col1", items: getItems(10) },
    col2: { id: "col2", items: getItems(10, 10) },
    col3: { id: "col3", items: getItems(10, 20) },
    col4: { id: "col4", items: getItems(10, 30) },
  });

  const [draggingItemId, setDraggingItemId] = useState(null);
  const [invalidDrop, setInvalidDrop] = useState(false);

  const handleDragStart = (start) => {
    setDraggingItemId(start.draggableId);
    setInvalidDrop(false);
  };

  const handleDragUpdate = (update) => {
    const { destination, source } = update;
    if (!destination) {
      setInvalidDrop(false);
      return;
    }

    const draggingItemK = parseInt(draggingItemId.split("-")[1]);

    const isInvalidDrop =
      (destination.droppableId === "col3" && source.droppableId === "col1") || // 첫 번째에서 세 번째로 이동 불가
      (destination.index > 0 &&
        columns[destination.droppableId].items[
          destination.index - 1
        ].content.split(" ")[1] %
          2 ===
          0 &&
        draggingItemK % 2 === 0 &&
        destination.index !== 0); // 짝수 아이템이 짝수 아이템 앞에 올 수 없음

    setInvalidDrop(isInvalidDrop);
  };

  const handleDragEnd = (result) => {
    setDraggingItemId(null);
    setInvalidDrop(false);
    if (!result.destination) return;

    const { source, destination } = result;

    const draggingItemK = parseInt(draggingItemId.split("-")[1]);

    const isInvalidDrop =
      (destination.droppableId === "col3" && source.droppableId === "col1") || // 첫 번째에서 세 번째로 이동 불가
      (destination.index > 0 &&
        columns[destination.droppableId].items[
          destination.index - 1
        ].content.split(" ")[1] %
          2 ===
          0 &&
        draggingItemK % 2 === 0 &&
        destination.index !== 0); // 짝수 아이템이 짝수 아이템 앞에 올 수 없음

    if (isInvalidDrop) {
      setInvalidDrop(isInvalidDrop);
      toast.error("올바르게 이동해주세요.");
      return;
    }

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
    toast.success(
      `${source.droppableId} -> ${destination.droppableId} 이동 성공!`
    );
  };
  return (
    <div>
      <div className="pl-2 pt-2">
        <div className="flex items-center">
          <p className="size-4 bg-red-900" /> &nbsp;: 제약사항 있음
        </div>
        <div className="flex items-center">
          <p className="size-4 bg-blue-600" />
          &nbsp;: 제약사항 없음
        </div>
      </div>
      <div className="flex justify-around items-center h-screen ">
        <Toaster />
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
        >
          {Object.values(columns).map((column) => (
            <div
              className="h-screen overflow-y-scroll w-full flex flex-col justify-center items-center"
              key={column.id}
            >
              <Column
                items={column.items.map((item) => ({
                  ...item,
                  isDragging: item.id === draggingItemId,
                  isInvalidDrop: invalidDrop,
                }))}
                columnId={column.id}
              />
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
