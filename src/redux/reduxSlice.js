import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  sortBy: "RECENT",
  filter: "ALL",
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos(state, action) {
      state.todos = action.payload;
    },

    addTodo(state, action) {
      state.todos.unshift(action.payload);
    },

    updateTodo(state, action) {
      const idx = state.todos.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.todos[idx] = action.payload;
      }
    },

    deleteTodo(state, action) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },

    toggleTodo(state, action) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = Date.now();
      }
    },

    setFilter(state, action) {
      state.filter = action.payload;
    },

    setSort(state, action) {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  setFilter,
  setSort,
} = todoSlice.actions;

export default todoSlice.reducer;