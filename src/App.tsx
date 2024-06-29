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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

type Todo = {
  id: string;
  label: string;
  done: boolean;
};

type State = {
  items: Record<string, Todo>;
  order: string[];
};

const defaultState: State = {
  items: {
    "1": { id: "1", label: "Matematik", done: true },
    "2": { id: "2", label: "Spise", done: false },
    "3": { id: "3", label: "Have det rigtig sjovt", done: false },
  },
  order: ["1", "2", "3"],
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
    <div>
      <h1>Min skoledag</h1>

      <button type="button" onClick={() => setEditingMode(!editingMode)}>
        {editingMode ? "Done" : "Edit"}
      </button>

      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((t) => (
            <Todo
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
      </DndContext>

      <NewTodo onAdd={handleAdd} />
    </div>
  );
}

export default App;

type NewTodoProps = {
  onAdd: (label: string) => void;
};
function NewTodo({ onAdd }: NewTodoProps) {
  const [label, setLabel] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      onAdd(label);
      setLabel("");
    }
  }

  return (
    <input
      type="text"
      value={label}
      onChange={(e) => setLabel(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
    />
  );
}

type TodoProps = {
  id: Todo["id"];
  label: Todo["label"];
  done: Todo["done"];
  onDoneChange: () => void;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  editingMode: boolean;
};

function Todo({
  id,
  label,
  done,
  onDoneChange,
  onLabelChange,
  onDelete,
  editingMode,
}: TodoProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleX: 1, scaleY: 1 } : null,
    ),
  };

  return (
    <div ref={setNodeRef} style={style} className="todo">
      <label>
        <input type="checkbox" checked={done} onChange={onDoneChange} />
      </label>

      <input
        type="text"
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
      />

      <div {...attributes} {...listeners}>
        Drag
      </div>

      {editingMode && (
        <button type="button" onClick={onDelete}>
          X
        </button>
      )}
    </div>
  );
}
