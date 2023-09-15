"use strict";

import normalize from "./normalize.css";
import reset from "./reset.css";
import style from "./style.css";

import Project from "./lib/project/Project";
import ProjectHTMLWrapper from "./lib/project/ProjectHTMLWrapper";

class ToDoApp {
  get projects() {
    return this._projects;
  }

  constructor(defaultProjects = []) {
    this._projects = [...defaultProjects];
    this.updateProjectList();

    if (defaultProjects.length > 0) {
      this.setActiveProject(defaultProjects[0]);
    }

    const newProjectBtn = document.getElementById("new-project-btn");
    newProjectBtn.addEventListener("click", () => {
      const newProject = this.createProject("Untitled Project", "");
      this.setActiveProject(newProject);
    });
  }

  updateProjectList() {
    const listElement = document.querySelector(".project-list");
    listElement.replaceChildren();

    for (const project of this.projects) {
      const listItemElement = listElement.appendChild(
        document.createElement("li"),
      );

      const projectBtn = listItemElement.appendChild(
        document.createElement("button"),
      );
      projectBtn.type = "button";
      projectBtn.textContent = project.title;
      projectBtn.addEventListener("click", () => {
        this.setActiveProject(project);
      });
    }
  }

  setActiveProject(activeProject) {
    const containerElement = document.querySelector(".project-container");
    containerElement.replaceChildren();

    const projectElement = containerElement.appendChild(
      ProjectHTMLWrapper.generateProjectHTMLElement(activeProject),
    );
  }

  createProject(title, description) {
    const project = new Project(title, description);
    this.projects.push(project);
    this.updateProjectList();
    return project;
  }
}

const app = new ToDoApp([
  new Project("New Project", "A cool description."),
  new Project("Project B", "A cooler description."),
]);
