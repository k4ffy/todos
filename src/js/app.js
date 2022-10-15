import Template from "./template.mjs";
import Controller from "./controller.mjs";
import Model from "./model.mjs";
import View from "./view.mjs";

const template = new Template();
const model = new Model();
const view = new View(template);
const controller = new Controller(model, view);

const app = () => controller.setView(location.hash);

window.addEventListener('load', app);
window.addEventListener('hashchange', app);
