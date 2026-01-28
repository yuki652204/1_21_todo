document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoBody = document.getElementById('todo-body');

    async function fetchTodos() {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        todoBody.innerHTML = '';
        todos.forEach(todo => {
            const isDone = todo.completed || todo.getCompleted;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span id="text-${todo.id}" class="todo-text ${isDone ? 'completed' : ''}">${todo.title}</span>
                    <input type="text" id="edit-${todo.id}" class="edit-input" style="display:none" value="${todo.title}">
                </td>
                <td class="action-btns">
                    <button class="edit-btn" id="btn-edit-${todo.id}">編集</button>
                    <button class="delete-btn" id="btn-del-${todo.id}">削除</button>
                </td>
            `;

            // クリックイベント
            const textSpan = tr.querySelector(`#text-${todo.id}`);
            const editInput = tr.querySelector(`#edit-${todo.id}`);
            const editBtn = tr.querySelector(`#btn-edit-${todo.id}`);

            // 完了切り替え（テキストクリック）
            textSpan.onclick = () => toggleTodo(todo, isDone);

            // 編集モード切り替え
            editBtn.onclick = () => {
                if (editInput.style.display === 'none') {
                    editInput.style.display = 'inline';
                    textSpan.style.display = 'none';
                    editBtn.innerText = '保存';
                } else {
                    saveEdit(todo, editInput.value);
                }
            };

            tr.querySelector(`#btn-del-${todo.id}`).onclick = () => deleteTodo(todo.id);
            todoBody.appendChild(tr);
        });
    }

    async function saveEdit(todo, newTitle) {
        const updatedTodo = { ...todo, title: newTitle };
        await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });
        fetchTodos();
    }

    async function toggleTodo(todo, currentStatus) {
        const updatedTodo = { ...todo, completed: !currentStatus, getCompleted: !currentStatus };
        await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });
        fetchTodos();
    }

    async function addTodo() {
        const title = todoInput.value;
        if (!title) return;
        await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, completed: false })
        });
        todoInput.value = '';
        fetchTodos();
    }

    async function deleteTodo(id) {
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
    }

    addBtn.onclick = addTodo;
    fetchTodos();
});

// 編集入力欄でEnterキーが押されたら保存する処理を、
// fetchTodos内のボタン生成ループの後に追記するか、今のロジックを微調整してください。
// 今回は「保存ボタン」で完結しているので、スタイルの反映を確認しましょう。
