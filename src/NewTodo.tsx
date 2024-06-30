import { useState } from "react";

type NewTodoProps = {
  onAdd: (label: string) => void;
};

export function NewTodo({ onAdd }: NewTodoProps) {
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
      className="todo__input"
      placeholder="Tilføj"
    />
  );
}
