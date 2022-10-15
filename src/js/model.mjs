import { trimSpaces } from "./helpers.mjs";

export default class Model {
	todos = JSON.parse(localStorage.getItem('todos')) || [];


	constructor() {
		console.log(this.todos);
	}


	_commit() {
		localStorage.setItem('todos', JSON.stringify(this.todos));

		// debug
		console.log(this.todos);
	}


	addTodo(title, descr, cb) {
		const todo = {
			id: Date.now(),
			title: trimSpaces(title),
			descr: trimSpaces(descr) || '',
			completed: false
		};

		this.todos.push(todo);
		this._commit();

		cb(todo);
	}

	editTodo(id, title, descr, cb) {
		this.todos = this.todos.map(todo => {
			return todo.id === id ? {
				id: todo.id,
				title: trimSpaces(title),
				descr: trimSpaces(descr),
				completed: todo.completed
			} : todo;
		});

		this._commit();

		cb(id, title, descr);
	}

	deleteTodo(id, cb) {
		this.todos = this.todos.filter(todo => todo.id !== id);

		this._commit();

		cb(id);
	}

	toggleTodoCompleted(id, cb) {
		this.todos = this.todos.map(todo => {
			return todo.id === id ? {
				id: todo.id,
				title: todo.title,
				descr: todo.descr,
				completed: !todo.completed
			} : todo;
		});

		this._commit();

		cb(id);
	}

	removeCompletedTodos(cb) {
		const completedTodos = this.todos.filter(todo => todo.completed);
		this.todos = this.todos.filter(todo => !todo.completed);

		this._commit();

		cb(completedTodos);
	}
};
