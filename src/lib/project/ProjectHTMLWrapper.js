"use strict";

export { ProjectHTMLWrapper as default };

class ProjectHTMLWrapper {
  static generateProjectHTMLElement(project) {
    const element = document.createElement("div");

    const header = element.appendChild(document.createElement("header"));

    const title = header.appendChild(document.createElement("h1"));
    title.textContent = project.title;

    const description = header.appendChild(document.createElement("h2"));
    description.textContent = project.description;

    const todoContainer = element.appendChild(
      document.createElement("todo-container"),
    );

    return element;
  }
}
