import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/App.css";

const Dnd: React.FC = () => {
  const groups = ["group1", "group2"];
  const [items, setItems] = useState([
    { id: 1, group: groups[0], value: "Item 1" },
    { id: 2, group: groups[0], value: "Item 2" },
    { id: 3, group: groups[0], value: "Item 3" },
    { id: 4, group: groups[1], value: "Item 4" },
    { id: 5, group: groups[1], value: "Item 5" },
  ]);

  const initialOrders = groups.reduce((acc, group) => {
    acc[group] = items
      .filter((item) => item.group === group)
      .map((item) => item.id);
    return acc;
  }, {} as Record<string, number[]>);

  const [orders, setOrders] = useState(initialOrders);
  const [dragging, setDragging] = useState<HTMLElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    setDragging(e.target as HTMLElement);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, group: string) => {
    e.preventDefault();
    if (dragging) {
      const draggedId = parseInt(dragging.id);
      const draggedItem = items.find((item) => item.id === draggedId);

      if (draggedItem) {
        const oldGroup = draggedItem.group;
        const newOrder = [...orders[group]];
        const oldOrder = [...orders[oldGroup]];

        // Remove from old group
        const oldIndex = oldOrder.indexOf(draggedId);
        if (oldIndex > -1) {
          oldOrder.splice(oldIndex, 1);
        }

        // Add to new group
        newOrder.push(draggedId);

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === draggedId ? { ...item, group } : item
          )
        );

        setOrders((prevOrders) => ({
          ...prevOrders,
          [oldGroup]: oldOrder,
          [group]: newOrder,
        }));

        setDragging(null);
      }
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
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
                  onDragStart={(e) => handleDragStart(e)}
                  onDragEnd={() => handleDragEnd()}
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
