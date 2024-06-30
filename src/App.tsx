import {
  type Active,
  DndContext,
  MeasuringStrategy,
  MouseSensor,
  type Over,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { NewTodo } from "./NewTodo";
import { TodoItem } from "./TodoItem";
import type { State } from "./types";

const defaultState: State = {
  items: {},
  order: [],
};

function App() {
  const [state, setState] = useLocalStorageState("todos", {
    defaultValue: defaultState,
  });

  const [editingMode, setEditingMode] = useState(false);

  function handleDoneChange(id: string) {
    setState((state) => {
      return {
        ...state,
        items: {
          ...state.items,
          [id]: {
            ...state.items[id],
            done: !state.items[id].done,
          },
        },
      };
    });
  }

  function handleLabelChange(id: string, label: string) {
    setState((state) => {
      return {
        ...state,
        items: {
          ...state.items,
          [id]: {
            ...state.items[id],
            label,
          },
        },
      };
    });
  }

  function handleDelete(id: string) {
    setState((state) => {
      const { [id]: _, ...nextItems } = state.items;

      return {
        items: nextItems,
        order: state.order.filter((t) => t !== id),
      };
    });
  }

  function handleAdd(label: string) {
    setState((state) => {
      const id = String(Math.random());
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { id, label, done: false },
        },
        order: [...state.order, id],
      };
    });
  }

  function handleDragEnd({
    active,
    over,
  }: { active: Active; over: Over | null }) {
    if (!over) {
      return;
    }

    if (active.id === over.id) {
      return;
    }

    if (
      !active.data.current ||
      !over.data.current ||
      active.data.current.sortable.containerId !==
        over.data.current.sortable.containerId
    ) {
      return;
    }

    const overIndex = over.data.current.sortable.index;
    const activeIndex = active.data.current.sortable.index;

    setState((state) => {
      return {
        ...state,
        order: arrayMove(state.order, activeIndex, overIndex),
      };
    });
  }

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const items = state.order.map((id) => state.items[id]);

  return (
    <div className="container">
      <h1 className="header">Min skoledag</h1>

      <button
        type="button"
        className="edit-mode"
        onClick={() => setEditingMode(!editingMode)}
      />

      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="todo-list">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((t) => (
              <TodoItem
                key={t.id}
                id={t.id}
                label={t.label}
                done={t.done}
                onDoneChange={() => handleDoneChange(t.id)}
                onLabelChange={(label) => handleLabelChange(t.id, label)}
                onDelete={() => handleDelete(t.id)}
                editingMode={editingMode}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <div className="new-todo-container">
        <NewTodo onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default App;
