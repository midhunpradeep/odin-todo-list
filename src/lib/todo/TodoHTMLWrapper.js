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
    title.classList.add("always-visible");

    const dueDate = this.htmlElement.appendChild(document.createElement("p"));
    dueDate.textContent = "Finish before: " + this.todo.dueDate.toDateString();
    dueDate.classList.add("todo-due-date");
    dueDate.classList.add("always-visible");

    this.htmlElement.dataset.priority = this.todo.priority;

    const description = this.htmlElement.appendChild(
      document.createElement("p"),
    );
    description.textContent = this.todo.description;

    const expandBtn = this.htmlElement.appendChild(
      document.createElement("button"),
    );
    expandBtn.type = "button";
    expandBtn.classList.add("always-visible");
    expandBtn.classList.add("todo-expand-btn");

    expandBtn.updateText = () => {
      expandBtn.innerHTML = this.htmlElement.classList.contains("expanded")
        ? "<span class='material-symbols-outlined'>expand_less</span>"
        : "<span class='material-symbols-outlined'>expand_more</span>";
    };
    expandBtn.updateText();

    expandBtn.addEventListener("click", () => {
      if (!this.htmlElement.classList.contains("expanded")) {
        const otherExpandedElements =
          this.htmlElement.parentElement.querySelectorAll(".expanded");
        for (const expandedElement of otherExpandedElements) {
          expandedElement.classList.remove("expanded");
        }
      }

      this.htmlElement.classList.toggle("expanded");
      expandBtn.updateText();
    });
  }
}
