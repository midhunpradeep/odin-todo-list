"use strict";

import normalize from "./normalize.css";
import reset from "./reset.css";
import style from "./style.css";

import Project from "./lib/project/Project";
import ProjectHTMLWrapper from "./lib/project/ProjectHTMLWrapper";
import Todo from "./lib/todo/Todo";

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

  setActiveProject(activeProject = null) {
    const containerElement = document.querySelector(".project-container");
    containerElement.replaceChildren();

    if (activeProject === null) {
      return;
    }

    const projectElement = containerElement.appendChild(
      new ProjectHTMLWrapper(
        activeProject,
        () => {
          this.removeProject(activeProject);
          this.setActiveProject();
        },
        () => {
          this.updateProjectList();
        },
      ).htmlElement,
    );
  }

  createProject(title, description) {
    const project = new Project(title, description);
    this.projects.push(project);
    this.updateProjectList();
    return project;
  }

  removeProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
    this.updateProjectList();
  }
}

const app = new ToDoApp([
  new Project("New Project", "A cool description.", [
    new Todo("New Todo", "A passable description", new Date(), 3),
  ]),
  new Project("Project B", "A cooler description."),
]);
