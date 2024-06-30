export type Todo = {
  id: string;
  label: string;
  done: boolean;
};

export type State = {
  items: Record<string, Todo>;
  order: string[];
};
