import { createSelector } from "@reduxjs/toolkit";

export const selectTodos = s => s.todo.todos;
export const selectFilter = s => s.todo.filter;
export const selectSort = s => s.todo.sortBy;

export const selectFilteredTodos = createSelector(
    [selectTodos, selectFilter, selectSort],
    (todos, filter, sort) => {
        let list = todos;

        if (filter === "ACTIVE") list = todos.filter(t => !t.completed);
        if (filter === "DONE") list = todos.filter(t => t.completed);

        if (sort === "RECENT") return [...list].sort((a, b) => b.createdAt - a.createdAt);
        if (sort === "ID") return [...list].sort((a, b) => Number(a.id) - Number(b.id));

        return list;
    }
);

export const selectCounters = createSelector([selectTodos], todos => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
}));