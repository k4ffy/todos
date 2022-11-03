import { escapeCharacters } from "./helpers.mjs";

export default class Template {
	createTodo(todo) {
		return `
	<li class="todo-list__item todo-item${todo.completed ? ' completed' : ''}" data-id="${todo.id}">
		<div class="todo-item__checkbox">
			<input type="checkbox" ${todo.completed ? 'checked' : ''}>
			<div class="checkbox"></div>
		</div>

		<div class="todo-item__body">
			<div class="todo-item__title">${escapeCharacters(todo.title)}</div>

			<p class="todo-item__descr">${escapeCharacters(todo.descr)}</p>
		</div>
		
		<div class="todo-item__actions">
			<button class="todo-item__edit"></button>
			<button class="todo-item__remove"></button>
		</div>
	</li>`;
	}
};
