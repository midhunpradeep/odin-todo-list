"use strict";

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

  _updateHTMLElement() {}
}
