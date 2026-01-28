const API_URL = "/api/todos";

async function fetchTodos() {
    const res = await fetch(API_URL);
    const todos = await res.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-text ${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${todo.id}, '${todo.title}', ${todo.completed})">
                ${todo.title}
            </span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    if (!input.value) return;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value, completed: false })
    });
    input.value = '';
    fetchTodos();
}

async function toggleTodo(id, title, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: !completed })
    });
    fetchTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
}

fetchTodos();
