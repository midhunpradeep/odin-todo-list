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
    this._updateHTMLElement();
  }

  _updateHTMLElement() {
    this.htmlElement.dataset.uuid = uuidv4();
    this.htmlElement.replaceChildren();

    // TODO: implement html
    const title = this.htmlElement.appendChild(document.createElement("p"));
    title.textContent = this.todo.title;
  }
}
