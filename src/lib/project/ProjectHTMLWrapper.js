"use strict";

import { v4 as uuidv4 } from "uuid";

export { ProjectHTMLWrapper as default };

class ProjectHTMLWrapper {
  get project() {
    return this._project;
  }

  get htmlElement() {
    return this._htmlElement;
  }

  constructor(project, elementDeleteFunction = null) {
    this._project = project;
    this._htmlElement = this._generateProjectHTMLElement(
      project,
      elementDeleteFunction,
    );
  }

  _generateProjectHTMLElement(project, elementDeleteFunction = null) {
    const element = document.createElement("div");
    element.dataset.uuid = uuidv4();

    const header = element.appendChild(document.createElement("header"));

    const headerTextContainer = header.appendChild(
      document.createElement("div"),
    );
    headerTextContainer.classList.add("header-text-container");

    const title = headerTextContainer.appendChild(document.createElement("h1"));
    title.textContent = project.title;
    title.dataset.formLabel = "Title";

    const description = headerTextContainer.appendChild(
      document.createElement("h2"),
    );
    description.textContent = project.description;
    description.dataset.formLabel = "Description";

    const headerTextEditForm = header.appendChild(
      this._generateFormElement(element),
    );

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
    });

    const deleteBtn = headerBtnContainer.appendChild(
      document.createElement("button"),
    );
    deleteBtn.type = "button";
    deleteBtn.innerHTML =
      "<span class='material-symbols-outlined'>delete</span>";
    if (elementDeleteFunction !== null) {
      deleteBtn.addEventListener("click", () => {
        elementDeleteFunction();
      });
    } else {
      console.warn("No delete function provided for " + this);
    }

    const todoContainer = element.appendChild(
      document.createElement("todo-container"),
    );

    return element;
  }

  _generateFormElement(projectElement) {
    const formElement = document.createElement("form");
    formElement.classList.add("header-text-form");

    for (const editableElement of projectElement.querySelectorAll(
      "[data-form-label]",
    )) {
      const label = formElement.appendChild(document.createElement("label"));
      label.textContent = editableElement.dataset.formLabel;

      const input = formElement.appendChild(document.createElement("input"));
      input.id =
        projectElement.dataset.uuid + "-" + label.textContent.toLowerCase();
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

    const cancelBtn = buttonContainer.appendChild(
      document.createElement("button"),
    );
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";

    return formElement;
  }
}
