"use strict";

import { v4 as uuidv4 } from "uuid";

export { TodoHTMLWrapper as default };

class TodoHTMLWrapper {
  get todo() {
    return this._todo;
  }

  get htmlElement() {
    return this._htmlElement;
  }

  constructor(todo) {
    this._todo = todo;

    this._htmlElement = document.createElement("div");

    this.htmlElement.classList.add("todo");
    this._updateHTMLElement();
  }

  _updateHTMLElement() {
    this.htmlElement.dataset.uuid = uuidv4();
    this.htmlElement.replaceChildren();

    // TODO: implement html
    const title = this.htmlElement.appendChild(document.createElement("h4"));
    title.textContent = this.todo.title;

    const dueDate = this.htmlElement.appendChild(document.createElement("p"));
    dueDate.textContent = "Finish before: " + this.todo.dueDate.toDateString();
    dueDate.classList.add("todo-due-date");

    this.htmlElement.dataset.priority = this.todo.priority;
  }
}
