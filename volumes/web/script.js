const API_URL = '/api/todos';

async function fetchTodos() {
    const response = await fetch(API_URL);
    const todos = await response.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.id = `todo-${todo.id}`;
        // 初期状態の表示
        renderTodoItem(li, todo);
        list.appendChild(li);
    });
}

// 通常時の表示を作成する関数
function renderTodoItem(li, todo) {
    li.innerHTML = `
        <span class="todo-text" onclick="toggleTodo(${todo.id}, '${todo.title}', ${todo.completed})">${todo.title}</span>
        <div class="actions">
            <button class="btn-edit" onclick="enterEditMode(${todo.id}, '${todo.title}')">編集</button>
            <button class="btn-del" onclick="deleteTodo(${todo.id})">削除</button>
        </div>
    `;
}

// 編集モード（入力欄を表示）に切り替える関数
function enterEditMode(id, oldTitle) {
    const li = document.getElementById(`todo-${id}`);
    li.innerHTML = `
        <input type="text" class="edit-input" id="input-${id}" value="${oldTitle}">
        <div class="actions">
            <button class="btn-save" onclick="saveEdit(${id})">保存</button>
            <button class="btn-cancel" onclick="fetchTodos()">戻る</button>
        </div>
    `;
    document.getElementById(`input-${id}`).focus();
}

// 非同期で保存を実行
async function saveEdit(id) {
    const newTitle = document.getElementById(`input-${id}`).value;
    if (!newTitle.trim()) return;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), completed: false })
    });
    fetchTodos();
}

async function addTodo() {
    const input = document.getElementById('todo-input');
    const title = input.value.trim();
    if (!title) return;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: false })
    });
    input.value = '';
    fetchTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
}

async function toggleTodo(id, title, currentStatus) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: !currentStatus })
    });
    fetchTodos();
}

fetchTodos();
