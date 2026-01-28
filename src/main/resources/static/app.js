const API_URL = "http://localhost:7080/api/todos";
let clickTimer = null;
let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    
    // 入力欄でEnterキーを押した時にも追加されるようにする
    const input = document.getElementById('todoTitle');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        
        // 【並び替え機能】
        // 未完了(completed: false)を上に、完了(true)を下に並び替える
        todos.sort((a, b) => a.completed - b.completed);

        const listElement = document.getElementById('todo-list');
        listElement.innerHTML = '';
        
        clearTimeout(clickTimer);
        clickTimer = null;
        isEditing = false;

        todos.forEach(todo => {
            const item = document.createElement('div');
            item.className = 'todo-item';
            const titleClass = todo.completed ? 'completed' : '';
            
            item.innerHTML = `
                <div class="todo-content">
                    <span class="todo-text ${titleClass}">${todo.title}</span>
                    <input type="text" class="edit-input" value="${todo.title}" style="display:none;">
                </div>
                <button class="delete-btn">×</button>
            `;

            const textSpan = item.querySelector('.todo-text');
            const editInput = item.querySelector('.edit-input');
            const delBtn = item.querySelector('.delete-btn');

            textSpan.onclick = () => {
                if (isEditing) return;
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    enterEditMode(textSpan, editInput);
                } else {
                    clickTimer = setTimeout(async () => {
                        await toggleTodo(todo.id, todo.title, todo.completed);
                        clickTimer = null;
                    }, 300);
                }
            };

            editInput.onkeydown = async (e) => {
                if (e.key === 'Enter') {
                    isEditing = false;
                    await updateTodo(todo.id, editInput.value, todo.completed);
                    fetchTodos();
                } else if (e.key === 'Escape') {
                    fetchTodos();
                }
            };

            delBtn.onclick = (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            };

            listElement.appendChild(item);
        });
    } catch (e) { console.error("表示エラー:", e); }
}

async function addTodo() {
    const input = document.getElementById('todoTitle');
    const title = input.value.trim();
    if (!title) return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, completed: false })
        });
        input.value = '';
        await fetchTodos();
    } catch (e) { console.error("追加失敗:", e); }
}

async function toggleTodo(id, title, completed) {
    await updateTodo(id, title, !completed);
    fetchTodos();
}

async function updateTodo(id, newTitle, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, completed: completed })
    });
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchTodos();
}

function enterEditMode(span, input) {
    isEditing = true;
    span.style.display = 'none';
    input.style.display = 'block';
    input.focus();
    const val = input.value;
    input.value = '';
    input.value = val;
}