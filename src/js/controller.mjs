export default class Controller {
	_currentRoute = '';

	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.view.bindAddTodo(this.handleAddTodo);
		this.view.bindRemoveTodo(this.handleRemoveTodo);
		this.view.bindToggleTodoCompleted(this.handleToggleTodoCompleted);
		this.view.bindEditTodoSave(this.handleEditTodoSave);
		this.view.bindEditTodoCancel(this.handleEditTodoCancel);
		this.view.bindRemoveCompletedTodos(this.handleRemoveCompletedTodos);

		this.view.updateTabsCounter(this.model.todos);
		this.view.showCompletedBtn(this.model.todos.filter(todo => todo.completed));
	}


	setView(hash) {
		const route = hash.replace(/#\//, '');
		const todos = this.model.todos;

		this._currentRoute = route;

		console.log('current route:', route)

		switch (route) {
			case 'active':
				this.view.showFilteredTodos(todos.filter(todo => !todo.completed))
				break;
			case 'completed':
				this.view.showFilteredTodos(todos.filter(todo => todo.completed))
				break;
			default:
				this.view.showFilteredTodos(todos);
				break;
		}

		this.view.updateActiveTab(route);
		this.updateEmptyUI(this._currentRoute);
	}

	updateEmptyUI() {
		const todos = this.model.todos;
		let status = '';

		if (this._currentRoute === 'completed') {
			status = todos.filter(todo => todo.completed).length === 0 ? 'empty' : 'not-empty';
		} else if (this._currentRoute === 'active') {
			status = todos.filter(todo => !todo.completed).length === 0 ? 'empty' : 'not-empty';
		} else {
			status = this.model.todos.length === 0 ? 'empty' : 'not-empty';
		}

		this.view.showEmptyUI(status);
	}


	handleAddTodo = (title, descr,) => {
		if (title.trim() === '') {
			return;
		}

		this.model.addTodo(title, descr, (title, descr) => {
			if (this._currentRoute !== 'completed') {
				this.view.renderTodo(title, descr);	
			}
		});

		this.updateEmptyUI();
		this.view.updateTabsCounter(this.model.todos);
	}

	handleRemoveTodo = (id) => {
		this.model.deleteTodo(id, (id) => {
			this.view.removeTodo(id);
		});

		this.updateEmptyUI();
		this.view.updateTabsCounter(this.model.todos);
	}

	handleToggleTodoCompleted = (id) => {
		this.model.toggleTodoCompleted(id, (id) => {
			this.view.toggleTodo(id, this._currentRoute);
		});

		this.updateEmptyUI();
		this.view.updateTabsCounter(this.model.todos);
	}

	handleEditTodoSave = (id, title, descr) => {
		if (title.trim().length !== 0) {
			this.model.editTodo(id, title, descr, (id, title, descr) => {
				this.view.editTodoDone(id, title, descr);
			});
		}
	}

	handleEditTodoCancel = (id, title, descr) => {
		this.view.editTodoDone(id, title, descr);
	}

	handleRemoveCompletedTodos = () => {
		this.model.removeCompletedTodos((completedTodos) => {
			return this.view.removeCompletedTodos(completedTodos);
		});

		this.updateEmptyUI();
		this.view.updateTabsCounter(this.model.todos);
	}
};
