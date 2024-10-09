import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./styles/App.css";

const Dnd: React.FC = () => {
  const groups = ["group1", "group2"];
  const [items, setItems] = useState([
    { id: 1, group: groups[0], value: "Chicken" },
    { id: 2, group: groups[0], value: "Monkey" },
    { id: 3, group: groups[1], value: "Rhino" },
    { id: 4, group: groups[0], value: "Duck" },
    { id: 5, group: groups[1], value: "Sandwich" },
    { id: 6, group: groups[1], value: "Ostrich" },
    { id: 7, group: groups[0], value: "Flamingo" },
  ]);

  const [dragging, setDragging] = useState<HTMLElement | null>(null);
  const [order, setOrder] = useState<number[]>(items.map((item) => item.id));
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (dragging === null) {
      setDragOver(null);
    }
  }, [dragging]);

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    setDragging(() => {
      console.log(
        `----------------------\nSelected ${
          (e.target as HTMLElement).id
        } to drag`
      );
      return e.target as HTMLElement;
    });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLElement>, id: number) => {
      e.preventDefault();
      const currentTime = new Date().toLocaleTimeString();

      if (dragOver !== id) {
        setDragOver(() => {
          if (dragging)
            console.log(`${currentTime} - Dragging ${dragging.id} over ${id}`);
          return id;
        });
      }

      if (dragging) {
        const draggedId = parseInt(dragging.id);
        const newOrder = [...order];
        const draggedIndex = newOrder.indexOf(draggedId);
        const hoverIndex = newOrder.indexOf(id);

        if (draggedIndex !== hoverIndex) {
          newOrder.splice(draggedIndex, 1);
          newOrder.splice(hoverIndex, 0, draggedId);
          setOrder(newOrder);
        }
      }
    },
    [dragging, dragOver, order]
  );

  const handleDrop = (e: React.DragEvent<HTMLElement>, id: number) => {
    e.preventDefault();
    if (dragging) {
      const draggedId = parseInt(dragging.id);
      const newOrder = [...order];
      const draggedIndex = newOrder.indexOf(draggedId);
      const dropIndex = newOrder.indexOf(id);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedId);

      setOrder(newOrder);

      setDragging(null);
      setDragOver(null);
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOver(null);
  };

  const handleDragEnter = (group: string) => {
    if (dragging) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === parseInt(dragging.id) ? { ...item, group } : item
        )
      );

      setOrder((prevOrder) => {
        const newOrder = prevOrder.filter((id) => id !== parseInt(dragging.id));
        newOrder.push(parseInt(dragging.id));
        return newOrder;
      });
    }
  };

  return (
    <div className="groups">
      {groups.map((group) => (
        <div
          className="group"
          key={group}
          onDragEnter={() => handleDragEnter(group)}
        >
          <h1 className="title">{group}</h1>

          <div>
            {order
              .map((id) => items.find((item) => item.id === id))
              .filter((item) => item?.group === group)
              .map((thing) => (
                <motion.div
                  key={thing!.id}
                  id={thing!.id.toString()}
                  className={`thing ${
                    dragOver === thing!.id ? "drag-over" : ""
                  }`}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(
                      e as unknown as React.DragEvent<HTMLElement>
                    )
                  }
                  onDragOver={(e) => handleDragOver(e, thing!.id)}
                  onDrop={(e) => handleDrop(e, thing!.id)}
                  onDragEnd={() => handleDragEnd()}
                  layout
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.1 }}
                >
                  {thing!.value} {thing!.id} {thing!.id === dragOver ? "!" : ""}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dnd;
