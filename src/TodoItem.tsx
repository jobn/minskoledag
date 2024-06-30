import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Todo } from "./types";

type TodoProps = {
  id: Todo["id"];
  label: Todo["label"];
  done: Todo["done"];
  onDoneChange: () => void;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  editingMode: boolean;
};

export function TodoItem({
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
        <input type="checkbox" hidden checked={done} onChange={onDoneChange} />

        {done ? (
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        ) : (
          <div className="checkmark__unchecked" />
        )}
      </label>

      <input
        type="text"
        className="todo__input"
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
      />

      <div {...attributes} {...listeners} className="drag-handle">
        <img
          src="/assets/drag-handle.svg"
          alt="Drag handle"
          className="drag-handle__icon"
        />
      </div>

      {editingMode && (
        <button type="button" className="todo__delete" onClick={onDelete}>
          X
        </button>
      )}
    </div>
  );
}
