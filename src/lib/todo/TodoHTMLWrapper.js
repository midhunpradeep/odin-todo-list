"use strict";

import { v4 as uuidv4 } from "uuid";
import { format, parse } from "date-fns";
import { ca, el } from "date-fns/locale";

export { TodoHTMLWrapper as default };

class TodoHTMLWrapper {
  get todo() {
    return this._todo;
  }

  get htmlElement() {
    return this._htmlElement;
  }

  constructor(todo, deleteFunction = null, parentUpdateFunction = null) {
    this._todo = todo;

    this._htmlElement = document.createElement("div");
    this._deleteFunction = deleteFunction;
    this._parentUpdateFunction = parentUpdateFunction;

    this.htmlElement.classList.add("todo");
    this._updateHTMLElement();
    this._addKeyBindings();
  }

  _updateHTMLElement() {
    this.htmlElement.dataset.uuid = uuidv4();
    this.htmlElement.replaceChildren();

    const todoContent = this.htmlElement.appendChild(
      document.createElement("div"),
    );
    todoContent.classList.add("todo-content");

    const todoForm = this.htmlElement.appendChild(
      document.createElement("form"),
    );
    todoForm.classList.add("todo-form");
    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    const todoControls = this.htmlElement.appendChild(
      document.createElement("div"),
    );
    todoControls.classList.add("todo-controls");
    todoControls.classList.add("only-in-expanded");

    const editBtn = todoControls.appendChild(document.createElement("button"));
    editBtn.type = "button";
    editBtn.classList.add("edit-toggle-btn");
    editBtn.innerHTML =
      "<span class='material-symbols-outlined'>edit_square</span>";

    editBtn.addEventListener("click", () => {
      this.htmlElement.classList.toggle("editing");

      if (this.htmlElement.classList.contains("editing")) {
        this._updateFormElement();
        todoForm.querySelector("input").select();
      } else {
        // refresh contents
        this._updateHTMLElement();
      }
    });

    const deleteBtn = todoControls.appendChild(
      document.createElement("button"),
    );
    deleteBtn.type = "button";
    deleteBtn.innerHTML =
      "<span class='material-symbols-outlined'>delete</span>";

    if (this._deleteFunction !== null) {
      deleteBtn.addEventListener("click", () => {
        this._deleteFunction();
      });
    } else {
      console.warn("No delete function provided for " + this);
    }

    const title = todoContent.appendChild(document.createElement("h4"));
    title.textContent = this.todo.title;
    title.classList.add("todo-title");

    const dueDate = todoContent.appendChild(document.createElement("p"));
    dueDate.textContent = "Finish before: " + this.todo.dueDate.toDateString();
    dueDate.classList.add("todo-due-date");

    this.htmlElement.dataset.priority = this.todo.priority;

    const description = todoContent.appendChild(document.createElement("p"));
    description.textContent = this.todo.description;
    description.classList.add("todo-description");
    description.classList.add("only-in-expanded");

    const expandBtn = this.htmlElement.appendChild(
      document.createElement("button"),
    );
    expandBtn.type = "button";
    expandBtn.classList.add("todo-expand-btn");

    expandBtn.updateText = () => {
      expandBtn.innerHTML = this.htmlElement.classList.contains("expanded")
        ? "<span class='material-symbols-outlined'>expand_less</span>"
        : "<span class='material-symbols-outlined'>expand_more</span>";
    };
    expandBtn.updateText();

    const expandTodo = (event) => {
      if (!this.htmlElement.classList.contains("expanded")) {
        const otherExpandedElements =
          this.htmlElement.parentElement.querySelectorAll(".expanded");
        for (const expandedElement of otherExpandedElements) {
          if (expandedElement === this.htmlElement) continue;
          expandedElement.classList.remove("expanded");
        }
        this.htmlElement.classList.add("expanded");
      } else {
        this.htmlElement.classList.remove("expanded");
      }
      expandBtn.updateText();
      event.stopPropagation();
    };

    expandBtn.addEventListener("click", expandTodo);
    this.htmlElement.onclick = (event) => {
      if (this.htmlElement.classList.contains("expanded")) return;
      expandTodo(event);
    };
  }

  _updateFormElement() {
    const formElement = this.htmlElement.querySelector(".todo-form");
    formElement.replaceChildren();

    const uuid = this.htmlElement.dataset.uuid;

    const title = formElement.appendChild(document.createElement("input"));
    title.value = this.todo.title;
    title.dataset.label = "Title";

    const dueDate = formElement.appendChild(document.createElement("input"));
    dueDate.type = "date";
    dueDate.value = format(this.todo.dueDate, "yyyy-MM-dd");
    dueDate.dataset.label = "Due Date";

    const description = formElement.appendChild(
      document.createElement("textarea"),
    );
    description.value = this.todo.description;
    description.dataset.label = "Description";

    const priority = formElement.appendChild(document.createElement("input"));
    priority.type = "range";
    priority.min = "0";
    priority.max = "3";
    priority.value = this.todo.priority;
    priority.dataset.label = "Priority";

    priority.addEventListener("input", () => {
      this.htmlElement.dataset.priority = priority.value;
    });

    for (const inputElement of formElement.querySelectorAll("[data-label]")) {
      const label = formElement.insertBefore(
        document.createElement("label"),
        inputElement,
      );
      inputElement.id =
        uuid +
        "-" +
        inputElement.dataset.label.replace(/\s+/g, "-").toLowerCase();
      label.textContent = inputElement.dataset.label;
      label.htmlFor = inputElement.id;
    }

    const buttonContainer = formElement.appendChild(
      document.createElement("div"),
    );
    buttonContainer.classList.add("todo-form-btns");

    const saveBtn = buttonContainer.appendChild(
      document.createElement("button"),
    );
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    saveBtn.classList.add("form-save-btn");

    const cancelBtn = buttonContainer.appendChild(
      document.createElement("button"),
    );
    cancelBtn.classList.add("form-cancel-btn");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";

    saveBtn.addEventListener("click", () => {
      this.todo.title = title.value;
      this.todo.dueDate = parse(dueDate.value, "yyyy-MM-dd", new Date());
      this.todo.description = description.value;
      this.todo.priority = priority.value;
      this.htmlElement.querySelector(".edit-toggle-btn").click();
      if (this._parentUpdateFunction !== null) {
        this._parentUpdateFunction();
      }
    });

    cancelBtn.addEventListener("click", () => {
      this.htmlElement.querySelector(".edit-toggle-btn").click();
    });
  }

  _addKeyBindings() {
    window.addEventListener("keyup", (event) => {
      if (!this.htmlElement.classList.contains("editing")) {
        return;
      }

      const formButtons = this.htmlElement.querySelector(
        ".todo-form .todo-form-btns",
      );

      if (event.key === "Escape") {
        event.preventDefault();
        formButtons.querySelector(".form-cancel-btn").click();
      } else if (event.key === "Enter") {
        event.preventDefault();
        formButtons.querySelector(".form-save-btn").click();
      }
    });
  }
}
