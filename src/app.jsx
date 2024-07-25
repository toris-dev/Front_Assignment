import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import Column from "./components/Column";

export default function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k + offset).map((k) => ({
      id: `item-${k + 1}`,
      content: `item ${k + 1}`,
    }));

  const [columns, setColumns] = useState({
    col1: { id: "col1", items: getItems(10) },
    col2: { id: "col2", items: getItems(10, 10) },
    col3: { id: "col3", items: getItems(10, 20) },
    col4: { id: "col4", items: getItems(10, 30) },
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [invalidDrop, setInvalidDrop] = useState(false);

  const handleItemClick = (itemId, event) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedItems([itemId]);
    }
  };

  const handleDragStart = (start) => {
    setDraggingItemId(start.draggableId);
    setInvalidDrop(false);

    if (selectedItems.length === 0) {
      setSelectedItems([start.draggableId]);
    }
  };

  const handleDragUpdate = (update) => {
    const { destination, source } = update;
    if (!destination) {
      setInvalidDrop(false);
      return;
    }

    const draggingItemK = parseInt(draggingItemId.split("-")[1]);

    const isInvalidDrop =
      (destination.droppableId === "col3" && source.droppableId === "col1") ||
      (destination.index > 0 &&
        columns[destination.droppableId].items[
          destination.index - 1
        ].content.split(" ")[1] %
          2 ===
          0 &&
        draggingItemK % 2 === 0 &&
        destination.index !== 0);

    setInvalidDrop(isInvalidDrop);
  };

  const handleDragEnd = (result) => {
    setDraggingItemId(null);
    setInvalidDrop(false);
    if (!result.destination) return;

    const { source, destination } = result;

    const draggingItemK = parseInt(draggingItemId.split("-")[1]);

    const isInvalidDrop =
      (destination.droppableId === "col3" && source.droppableId === "col1") ||
      (destination.index > 0 &&
        columns[destination.droppableId].items[
          destination.index - 1
        ].content.split(" ")[1] %
          2 ===
          0 &&
        draggingItemK % 2 === 0 &&
        destination.index !== 0);

    if (isInvalidDrop) {
      toast.error("올바르게 이동해주세요.");
      return;
    }

    const newColumns = { ...columns };

    const itemsToMove = selectedItems
      .map((itemId) => {
        const sourceColumn = newColumns[source.droppableId];
        const itemIndex = sourceColumn.items.findIndex(
          (item) => item.id === itemId
        );

        if (itemIndex === -1) {
          const itemNumber = itemId.split("-")[1];
          toast.error(`아이템 ${itemNumber}을(를) 이동할 수 없습니다.`);
          return null;
        }

        return sourceColumn.items[itemIndex];
      })
      .filter(Boolean);

    if (itemsToMove.length === 0) {
      toast.error(`이동할 아이템이 없습니다.`);
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const column = newColumns[source.droppableId];
      const newItems = Array.from(column.items);
      itemsToMove.forEach((item, index) => {
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        const [removed] = newItems.splice(itemIndex, 1);
        newItems.splice(destination.index + index, 0, removed);
      });
      newColumns[source.droppableId].items = newItems;
    } else {
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      itemsToMove.forEach((item, index) => {
        const itemIndex = sourceItems.findIndex((i) => i.id === item.id);
        const [removed] = sourceItems.splice(itemIndex, 1);
        destItems.splice(destination.index + index, 0, removed);
      });

      newColumns[source.droppableId].items = sourceItems;
      newColumns[destination.droppableId].items = destItems;
    }

    setColumns(newColumns);
    setSelectedItems([]);
    toast.success(
      `${source.droppableId} -> ${destination.droppableId} 이동 성공!`
    );
  };

  return (
    <div>
      <div className="flex justify-around items-center h-screen ">
        <Toaster />
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
        >
          {Object.values(columns).map((column) => (
            <div
              className="h-screen w-full flex flex-col justify-center items-center"
              key={column.id}
            >
              <Column
                items={column.items}
                columnId={column.id}
                selectedItems={selectedItems}
                handleItemClick={handleItemClick}
                invalidDrop={invalidDrop}
              />
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
