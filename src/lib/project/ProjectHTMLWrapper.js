"use strict";

import { v4 as uuidv4 } from "uuid";
import Todo from "../todo/Todo";
import TodoHTMLWrapper from "../todo/TodoHTMLWrapper";

export { ProjectHTMLWrapper as default };

class ProjectHTMLWrapper {
  get project() {
    return this._project;
  }

  get htmlElement() {
    return this._htmlElement;
  }

  constructor(
    project,
    elementDeleteFunction = null,
    parentUpdateFunction = null,
  ) {
    this._project = project;
    this._deleteFunction = elementDeleteFunction;
    this._parentUpdateFunction = parentUpdateFunction;

    this._htmlElement = document.createElement("div");
    this._updateHTMLElement();
    this._addKeyBindings();
  }

  _updateHTMLElement() {
    this.htmlElement.dataset.uuid = uuidv4();
    this.htmlElement.replaceChildren();

    const header = this.htmlElement.appendChild(
      document.createElement("header"),
    );

    const headerTextContainer = header.appendChild(
      document.createElement("div"),
    );
    headerTextContainer.classList.add("header-text-container");

    const title = headerTextContainer.appendChild(document.createElement("h1"));
    title.textContent = this.project.title;
    title.dataset.formLabel = "Title";

    const description = headerTextContainer.appendChild(
      document.createElement("h2"),
    );
    description.textContent = this.project.description;
    description.dataset.formLabel = "Description";

    const headerTextEditForm = header.appendChild(
      document.createElement("form"),
    );
    headerTextEditForm.classList.add("header-text-form");

    const headerBtnContainer = header.appendChild(
      document.createElement("div"),
    );
    headerBtnContainer.classList.add("header-btn-container");

    const editBtn = headerBtnContainer.appendChild(
      document.createElement("button"),
    );
    editBtn.type = "button";
    editBtn.innerHTML =
      "<span class='material-symbols-outlined'>edit_square</span>";
    editBtn.addEventListener("click", () => {
      header.classList.toggle("editing");

      if (header.classList.contains("editing")) {
        this._updateFormElement();
        headerTextEditForm.querySelector("input").select();
      }
    });

    const deleteBtn = headerBtnContainer.appendChild(
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

    const content = this.htmlElement.appendChild(document.createElement("div"));
    content.classList.add("project-content");

    const contentControls = content.appendChild(document.createElement("div"));

    const contentHeading = contentControls.appendChild(
      document.createElement("h3"),
    );
    contentHeading.textContent = "Todos";

    const addTodoBtn = contentControls.appendChild(
      document.createElement("button"),
    );
    addTodoBtn.type = "button";
    addTodoBtn.innerHTML =
      "<span class='material-symbols-outlined'>library_add</span>";

    addTodoBtn.addEventListener("click", () => {
      this._addTodo();
    });

    const todoContainer = content.appendChild(document.createElement("div"));
    todoContainer.classList.add("todo-container");

    this._updateTodoContainer();

    if (this._parentUpdateFunction !== null) {
      this._parentUpdateFunction();
    }
  }

  _updateFormElement() {
    const formElement = this.htmlElement.querySelector(".header-text-form");
    formElement.replaceChildren();

    const editableElements =
      this.htmlElement.querySelectorAll("[data-form-label]");

    for (const editableElement of editableElements) {
      const label = formElement.appendChild(document.createElement("label"));
      label.textContent = editableElement.dataset.formLabel;

      const input = formElement.appendChild(document.createElement("input"));
      input.id =
        this.htmlElement.dataset.uuid + "-" + label.textContent.toLowerCase();
      label.htmlFor = input.id;
      input.value = editableElement.textContent;
    }

    const buttonContainer = formElement.appendChild(
      document.createElement("div"),
    );
    buttonContainer.classList.add("form-btn-container");

    const saveBtn = buttonContainer.appendChild(
      document.createElement("button"),
    );
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    saveBtn.classList.add("form-save-btn");

    saveBtn.addEventListener("click", () => {
      const inputElements = [...formElement.querySelectorAll("input")];
      this.project.title = inputElements[0].value;
      this.project.description = inputElements[1].value;
      this._updateHTMLElement();
    });

    const cancelBtn = buttonContainer.appendChild(
      document.createElement("button"),
    );
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("form-cancel-btn");

    cancelBtn.addEventListener("click", () => {
      this.htmlElement.querySelector("header").classList.remove("editing");
    });
  }

  _addKeyBindings() {
    window.addEventListener("keyup", (event) => {
      if (
        !this.htmlElement.querySelector("header").classList.contains("editing")
      ) {
        return;
      }

      const formButtons = this.htmlElement.querySelector(".form-btn-container");

      if (event.key === "Escape") {
        event.preventDefault();
        formButtons.querySelector(".form-cancel-btn").click();
      } else if (event.key === "Enter") {
        event.preventDefault();
        formButtons.querySelector(".form-save-btn").click();
      }
    });
  }

  _updateTodoContainer() {
    const todoContainer = this.htmlElement.querySelector(".todo-container");
    todoContainer.replaceChildren();

    this.project.sort();
    for (const todo of this.project) {
      const todoElement = new TodoHTMLWrapper(
        todo,
        () => {
          this._removeTodo();
        },
        () => {
          this._updateTodoContainer();
        },
      );
      todoContainer.appendChild(todoElement.htmlElement);
    }
  }

  _addTodo() {
    const todo = new Todo("New Todo", "A passable description", new Date());
    this.project.pushTodo(todo);
    this._updateTodoContainer();
  }

  _removeTodo(todo) {
    this.project.removeTodoAt(todo);
    this._updateTodoContainer();
  }
}
