import { getElement as $, trimSpaces } from './helpers.mjs';

export default class View {
	form = $('.todo-form');
	titleInput = $('.todo-form__input-title');
	descrInput = $('.todo-form__input-descr');
	todoList = $('.todo-list');
	tabs = $('.todo-tabs');
	completedRemoveBtn = $('[data-type="remove-completed"]');


	constructor(template) {
		this.template = template;

		this.todoList.addEventListener('click', (event) => this.handleClickEditTodo(event));
		this.todoList.addEventListener('dblclick', (event) => this.handleDblClickEditTodo(event));
	}


	renderTodo(todo) {
		const todoItem = this.template.createTodo(todo);

		this.todoList.insertAdjacentHTML('afterbegin', todoItem);
	}

	removeTodo(id) {
		const item = $(`[data-id="${id}"]`);

		item.remove();
	}

	toggleTodo(id, route) {
		const item = $(`[data-id="${id}"]`);

		if (route === 'active' || route === 'completed') {
			item.remove();
		}

		item.classList.toggle('todo-item_completed');
	}

	showFilteredTodos(todos) {
		this.todoList.innerHTML = '';
		todos.forEach(todo => this.renderTodo(todo));
	}


	handleClickEditTodo(event) {
		const target = event.target;
		const item = target.closest('.todo-item');

		if (target.className === 'todo-item__edit') {
			this.editTodo(item);
		}
	}

	handleDblClickEditTodo(event) {
		const target = event.target;
		const item = target.closest('.todo-item');

		if (item && target.type !== 'checkbox') {
			if (!item.classList.contains('todo-item_editing')) {
				this.editTodo(item)
			}
		}
	}


	editTodo(item) {
		const title = $('.todo-item__title', item);
		const descr = $('.todo-item__descr', item);

		const titleInput = document.createElement('input');
		titleInput.dataset.type = 'updated-title';
		titleInput.placeholder = 'Task title';
		titleInput.value = title.innerText;
		title.after(titleInput);

		const descrInput = document.createElement('textarea');
		descrInput.dataset.type = 'updated-descr';
		descrInput.placeholder = 'Task description';
		descrInput.value = descr.innerText;
		descr.after(descrInput);

		item.classList.add('todo-item_editing');

		const editActions = `
		<div class="todo-item__body-actions">
			<button data-type="todo-edit-save" class="button">Save</button>
			<button data-type="todo-edit-cancel" class="button button_transparent">Cancel</button>
		</div>`;

		$('.todo-item__body', item).insertAdjacentHTML('beforeend', editActions);
	}


	editTodoDone(id, title, descr) {
		const item = $(`[data-id="${id}"]`);

		item.classList.remove('todo-item_editing');

		$('[data-type="updated-title"]', item).remove();
		$('[data-type="updated-descr"]', item).remove();

		$('.todo-item__title', item).innerText = title;
		$('.todo-item__descr', item).innerText = descr;

		$('.todo-item__body-actions', item).remove();
	}

	removeCompletedTodos(completedTodos) {
		completedTodos.forEach(todo => {
			const item = $(`[data-id="${todo.id}"]`);
			item.remove();
		});
	}

	showCompletedBtn(completedTodos) {
		if (completedTodos.length === 0) {
			this.completedRemoveBtn.classList.add('hidden');
		} else if (completedTodos.length > 0) {
			this.completedRemoveBtn.classList.remove('hidden');
		}
	}


	showEmptyUI(status) {
		if (status === 'empty') {
			const emptyUI = `<ul class="todo-list__empty">No tasks found <br><span>(×_×)</span></ul>`;

			this.todoList.innerHTML = emptyUI;
		} else {
			const emptyUI = $('.todo-list__empty');

			emptyUI ? emptyUI.remove() : null;
		}
	}

	updateTabsCounter(todos) {
		const all = todos.length;
		const active = todos.filter(todo => !todo.completed).length;
		const completed = todos.filter(todo => todo.completed).length;
		const completedTodos = todos.filter(todo => todo.completed);

		this.showCompletedBtn(completedTodos);

		$('[data-name="tab-all-counter"]').innerText = all;
		$('[data-name="tab-active-counter"]').innerText = active;
		$('[data-name="tab-completed-counter"]').innerText = completed;
	}

	updateActiveTab(route) {
		$('.todo-tabs__item_active').classList.toggle('todo-tabs__item_active');

		if (route === 'active' || route === 'completed') {
			return $(`[href="#/${route}"]`).classList.add('todo-tabs__item_active');
		}

		$(`[href="#/"]`).classList.add('todo-tabs__item_active');
	}


	bindAddTodo(handler) {
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();

			const title = trimSpaces(this.titleInput.value);
			const descr = trimSpaces(this.descrInput.value);

			if (title.trim() === '') {
				return alert('Отсутствует название задачи');
			}

			handler(title, descr);

			this.form.reset();
		});
	}

	bindRemoveTodo(handler) {
		this.todoList.addEventListener('click', (event) => {
			if (event.target.className === 'todo-item__remove') {
				const id = +event.target.closest('.todo-item').dataset.id;
				handler(id);
			}
		});
	}

	bindToggleTodoCompleted(handler) {
		this.todoList.addEventListener('click', (event) => {
			if (event.target.type === 'checkbox') {
				const id = +event.target.closest('.todo-item').dataset.id;
				handler(id);
			}
		});
	}

	bindEditTodoSave(handler) {
		this.todoList.addEventListener('click', (event) => {
			const target = event.target;

			if (target.dataset.type === 'todo-edit-save') {
				const item = target.closest('.todo-item');
				const id = +item.dataset.id;

				const title = $('[data-type="updated-title"]', item).value;
				const descr = $('[data-type="updated-descr"]', item).value;

				handler(id, title, descr);
			}
		});
	}

	bindEditTodoCancel(handler) {
		this.todoList.addEventListener('click', (event) => {
			const target = event.target;

			if (target.dataset.type === 'todo-edit-cancel') {
				const item = target.closest('.todo-item');
				const id = +item.dataset.id;

				const title = $('.todo-item__title', item).innerText;
				const descr = $('.todo-item__descr', item).innerText;

				handler(id, title, descr);
			}
		});
	}

	bindRemoveCompletedTodos(handler) {
		this.completedRemoveBtn.addEventListener('click', () => {
			handler();
		});
	}
};
