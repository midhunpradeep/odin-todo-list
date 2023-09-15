"use strict";

export { ProjectHTMLWrapper as default };

class ProjectHTMLWrapper {
  static generateProjectHTMLElement(project, deleteFunction = null) {
    const element = document.createElement("div");

    const header = element.appendChild(document.createElement("header"));

    const headerTextContainer = header.appendChild(
      document.createElement("div"),
    );

    const title = headerTextContainer.appendChild(document.createElement("h1"));
    title.textContent = project.title;

    const description = headerTextContainer.appendChild(
      document.createElement("h2"),
    );
    description.textContent = project.description;

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

    const deleteBtn = headerBtnContainer.appendChild(
      document.createElement("button"),
    );
    deleteBtn.type = "button";
    deleteBtn.innerHTML =
      "<span class='material-symbols-outlined'>delete</span>";
    if (deleteFunction !== null) {
      deleteBtn.addEventListener("click", () => {
        deleteFunction();
      });
    } else {
      console.warn("No delete function provided for " + this);
    }

    const todoContainer = element.appendChild(
      document.createElement("todo-container"),
    );

    return element;
  }
}
