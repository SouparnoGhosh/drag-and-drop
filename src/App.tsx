// src/Dnd.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/App.css";
import { bigitems as initialItems, biggroups as initialGroups } from "./data";

const Dnd: React.FC = () => {
  const [items, setItems] = useState(initialItems);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleDragStart = (e: React.PointerEvent<HTMLElement>, id: number) => {
    setDraggingId(id);
    (e as unknown as React.DragEvent<HTMLElement>).dataTransfer.effectAllowed =
      "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLElement>,
    group: string,
    id: number
  ) => {
    e.preventDefault();
    console.log(group);
    if (draggingId === null) return;

    const newItems = [...items];
    const draggedItemIndex = newItems.findIndex(
      (item) => item.id === draggingId
    );
    const hoverItemIndex = newItems.findIndex((item) => item.id === id);

    if (
      draggedItemIndex !== -1 &&
      hoverItemIndex !== -1 &&
      draggedItemIndex !== hoverItemIndex
    ) {
      const draggedItem = newItems[draggedItemIndex];
      newItems.splice(draggedItemIndex, 1);
      newItems.splice(hoverItemIndex, 0, draggedItem);
      setItems(newItems);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, group: string) => {
    e.preventDefault();
    if (draggingId === null) return;

    const newItems = items.map((item) =>
      item.id === draggingId ? { ...item, group } : item
    );
    setItems(newItems);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="groups">
      {initialGroups.map((group) => (
        <div
          className="group"
          key={group}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, group)}
        >
          <h1 className="title">{group}</h1>
          <div>
            {items
              .filter((item) => item.group === group)
              .map((thing) => (
                <motion.div
                  key={thing.id}
                  id={thing.id.toString()}
                  className="thing"
                  draggable
                  onPointerDown={(e: React.PointerEvent<HTMLElement>) =>
                    handleDragStart(e, thing.id)
                  }
                  onDragOver={(e) => handleDragOver(e, group, thing.id)}
                  onDragEnd={handleDragEnd}
                  layout
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2 }}
                >
                  {thing.value}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dnd;
