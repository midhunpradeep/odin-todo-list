"use strict";

import normalize from "./normalize.css";
import reset from "./reset.css";
import style from "./style.css";

import Project from "./lib/project/Project";
import ProjectHTMLWrapper from "./lib/project/ProjectHTMLWrapper";
import { retrieve, save } from "./lib/storage/storage";
import Todo from "./lib/todo/Todo";

class ToDoApp {
  get projects() {
    return this._projects;
  }

  constructor() {
    const savedProjects = this.retrieveProjects();

    this._projects = savedProjects ? savedProjects : this._defaultProjects();
    this.updateProjectList();

    this.setActiveProject(this.projects[0]);

    const newProjectBtn = document.getElementById("new-project-btn");
    newProjectBtn.addEventListener("click", () => {
      const newProject = this.createProject("Untitled Project", "");
      this.setActiveProject(newProject);
    });
  }

  _defaultProjects() {
    return [new Project("Untitled project")];
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
        () => {
          this.saveProjects();
        },
      ).htmlElement,
    );
  }

  createProject(title, description) {
    const project = new Project(title, description);
    this.projects.push(project);
    this.updateProjectList();
    this.saveProjects();
    return project;
  }

  removeProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
    this.updateProjectList();
    this.saveProjects();
  }

  saveProjects() {
    save("projects", this.projects);
  }

  retrieveProjects() {
    let projectData = retrieve("projects");
    if (projectData === null) return null;

    const projects = [];
    for (const data of projectData) {
      const project = new Project(data._title, data._description);
      for (const todoData of data._todos) {
        const todo = new Todo(
          todoData._title,
          todoData._description,
          new Date(todoData._dueDate),
          todoData._priority,
        );
        project.pushTodo(todo);
      }
      projects.push(project);
    }
    return projects;
  }
}

const app = new ToDoApp();
