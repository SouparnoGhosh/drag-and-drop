import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/App.css";
import { bigItems as initialItems, bigGroups as initialGroups } from "@/data";
// import { items as initialItems, groups as initialGroups } from "@/data";


const Dnd: React.FC = () => {
  const groups = initialGroups;
  const [items, setItems] = useState(initialItems);

  const initialOrders = groups.reduce((acc, group) => {
    acc[group] = items
      .filter((item) => item.group === group)
      .map((item) => item.id);
    return acc;
  }, {} as Record<string, number[]>);

  const [orders, setOrders] = useState(initialOrders);
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
    if (draggingId === null) return;

    const newOrder = [...orders[group]];
    const draggedIndex = newOrder.indexOf(draggingId);
    const hoverIndex = newOrder.indexOf(id);

    if (
      draggedIndex !== -1 &&
      hoverIndex !== -1 &&
      draggedIndex !== hoverIndex
    ) {
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(hoverIndex, 0, draggingId);
      setOrders((prevOrders) => ({
        ...prevOrders,
        [group]: newOrder,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, group: string) => {
    e.preventDefault();
    if (draggingId === null) return;

    const draggedItem = items.find((item) => item.id === draggingId);
    if (draggedItem && draggedItem.group !== group) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === draggingId ? { ...item, group } : item
        )
      );

      const oldGroup = draggedItem.group;
      const newOrder = [...orders[group], draggingId];
      const oldOrder = orders[oldGroup].filter((id) => id !== draggingId);

      setOrders((prevOrders) => ({
        ...prevOrders,
        [oldGroup]: oldOrder,
        [group]: newOrder,
      }));
    }

    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="groups">
      {groups.map((group) => (
        <div
          className="group"
          key={group}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, group)}
        >
          <h1 className="title">{group}</h1>
          <div>
            {orders[group]
              .map((id) => items.find((item) => item.id === id))
              .map((thing) => (
                <motion.div
                  key={thing!.id}
                  id={thing!.id.toString()}
                  className="thing"
                  draggable
                  onPointerDown={(e: React.PointerEvent<HTMLElement>) =>
                    handleDragStart(e, thing!.id)
                  }
                  onDragOver={(e) => handleDragOver(e, group, thing!.id)}
                  onDragEnd={handleDragEnd}
                  layout
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2 }}
                >
                  {thing!.value}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dnd;
