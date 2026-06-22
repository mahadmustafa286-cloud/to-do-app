window.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.input-container input[type="text"]');
  const addBtn = document.querySelector('.add-btn');
  const inputSection = document.querySelector('.input-container');
  let list = document.querySelector('.todo-list');

  const totalCount = document.querySelector('.dashboard .card:nth-child(1) h2');
  const completedCount = document.querySelector('.dashboard .card:nth-child(2) h2');
  const pendingCount = document.querySelector('.dashboard .card:nth-child(3) h2');

  if (!input || !addBtn || !inputSection) {
    console.warn('Todo script could not find the expected HTML elements.');
    return;
  }

  if (!list) {
    list = document.createElement('ul');
    list.className = 'todo-list';
    inputSection.parentNode.insertBefore(list, inputSection.nextSibling);
  }

  const saved = localStorage.getItem('todos');
  const todos = saved ? JSON.parse(saved) : [];

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function updateDashboard() {
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = todos.length - completed;

    if (totalCount) totalCount.textContent = String(todos.length);
    if (completedCount) completedCount.textContent = String(completed);
    if (pendingCount) pendingCount.textContent = String(pending);
  }

  function createTodoNode(todo, index) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.className = 'todo-checkbox';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 10px';
    textSpan.style.userSelect = 'none';
    textSpan.style.flex = '1';
    textSpan.style.display = 'inline-block';
    textSpan.style.wordBreak = 'break-word';

    if (todo.completed) {
      textSpan.style.textDecoration = 'line-through';
      textSpan.style.opacity = '0.7';
    }

    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      textSpan.style.textDecoration = todo.completed ? 'line-through' : '';
      textSpan.style.opacity = todo.completed ? '0.7' : '1';
      saveTodos();
      updateDashboard();
    });

    textSpan.addEventListener('dblclick', () => {
      const newText = prompt('Edit task', todo.text);
      if (newText !== null) {
        todo.text = newText.trim();
        if (todo.text.length) {
          textSpan.textContent = todo.text;
          saveTodos();
        }
      }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'todo-delete-btn';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';

    delBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      render();
      saveTodos();
    });

    const controls = document.createElement('div');
    controls.className = 'todo-controls';
    controls.style.display = 'flex';
    controls.style.alignItems = 'center';

    controls.appendChild(checkbox);
    controls.appendChild(textSpan);
    controls.appendChild(delBtn);
    li.appendChild(controls);

    return li;
  }

  function render() {
    list.innerHTML = '';

    if (todos.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'todo-empty';
      emptyMessage.textContent = 'No tasks added yet. Add a task above to get started.';
      list.appendChild(emptyMessage);
    } else {
      todos.forEach((todo, index) => {
        list.appendChild(createTodoNode(todo, index));
      });
    }

    updateDashboard();
  }

  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    // Validate that input contains at least one letter
    if (!/[a-zA-Z]/.test(text)) {
      alert('Please enter text containing at least one letter. Numbers and special characters alone are not allowed.');
      return;
    }

    todos.push({ text, completed: false });
    input.value = '';
    saveTodos();
    render();
  }

  addBtn.addEventListener('click', addTodo);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  render();
});