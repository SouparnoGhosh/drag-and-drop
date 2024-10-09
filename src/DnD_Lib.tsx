import React, { useState } from "react";
import "./styles/App.css";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const Dnd: React.FC = () => {
  const groups = ["group1", "group2", "group3"];
  const [items, setItems] = useState([
    { id: 1, group: groups[0], value: "Chicken" },
    { id: 2, group: groups[0], value: "Monkey" },
    { id: 3, group: groups[1], value: "Rhino" },
    { id: 4, group: groups[0], value: "Duck" },
    { id: 5, group: groups[1], value: "Sandwich" },
    { id: 6, group: groups[2], value: "Ostrich" },
    { id: 7, group: groups[2], value: "Flamingo" },
  ]);

  const initialOrders = groups.reduce((acc, group) => {
    acc[group] = items
      .filter((item) => item.group === group)
      .map((item) => item.id);
    return acc;
  }, {} as Record<string, number[]>);

  const [orders, setOrders] = useState(initialOrders);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceGroup = source.droppableId;
    const destinationGroup = destination.droppableId;

    if (sourceGroup === destinationGroup) {
      const newOrder = Array.from(orders[sourceGroup]);
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, parseInt(draggableId));

      setOrders((prevOrders) => ({
        ...prevOrders,
        [sourceGroup]: newOrder,
      }));
    } else {
      const sourceOrder = Array.from(orders[sourceGroup]);
      const destinationOrder = Array.from(orders[destinationGroup]);

      sourceOrder.splice(source.index, 1);
      destinationOrder.splice(destination.index, 0, parseInt(draggableId));

      setOrders((prevOrders) => ({
        ...prevOrders,
        [sourceGroup]: sourceOrder,
        [destinationGroup]: destinationOrder,
      }));

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === parseInt(draggableId)
            ? { ...item, group: destinationGroup }
            : item
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="groups">
        {groups.map((group) => (
          <Droppable droppableId={group} key={group}>
            {(provided) => (
              <div
                className="group"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h1 className="title">{group}</h1>
                <div>
                  {orders[group].map((id, index) => {
                    const thing = items.find((item) => item.id === id);
                    return (
                      <Draggable
                        key={thing!.id}
                        draggableId={thing!.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <motion.div
                              className="thing"
                              layout
                              whileHover={{ scale: 1.1 }}
                              whileDrag={{ scale: 1.2 }}
                            >
                              {thing!.value} {thing!.id}
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Dnd;
