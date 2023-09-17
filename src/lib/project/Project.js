"use strict";

export { Project as default };

class Project {
  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }
  constructor(title, description = "", defaultTodos = []) {
    this._title = title;
    this._description = description;
    this._todos = [...defaultTodos];
  }

  pushTodo(todo) {
    this._todos.push(todo);
  }

  getTodoAt(index) {
    return this._todos[index];
  }

  removeToDoAt(index) {
    this._todos.splice(index, 1);
  }

  sort() {
    this._todos.sort((a, b) => {
      return b.priority - a.priority;
    });
  }

  *[Symbol.iterator]() {
    for (const todo of this._todos) {
      yield todo;
    }
  }
}
