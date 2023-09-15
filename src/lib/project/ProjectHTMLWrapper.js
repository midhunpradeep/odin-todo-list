"use strict";

export { ProjectHTMLWrapper as default };

class ProjectHTMLWrapper {
  static generateProjectHTMLElement(project) {
    // TODO: implement method

    const element = document.createElement("div");
    element.textContent = project.title;
    return element;
  }
}
