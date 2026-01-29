const API_URL = window.location.port === "70" 
    ? "http://localhost:70/api/todos" 
    : "http://localhost:7080/api/todos";

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    const input = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");

    if (addBtn) addBtn.addEventListener("click", addTodo);
    if (input) input.addEventListener("keypress", (e) => { if (e.key === "Enter") addTodo(); });
});

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        const list = document.getElementById("todo-list");
        list.innerHTML = "";
        
        todos.sort((a, b) => a.completed - b.completed);

        todos.forEach(todo => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.title}</span>
                    <input class="edit-input" value="${todo.title}" style="display:none;">
                </td>
                <td style="text-align: right;">
                    <div class="action-btns">
                        <button class="edit-btn">編集</button>
                        <button class="delete-btn">削除</button>
                    </div>
                </td>
            `;

            const text = tr.querySelector(".todo-text");
            const editInput = tr.querySelector(".edit-input");
            const editBtn = tr.querySelector(".edit-btn");
            const delBtn = tr.querySelector(".delete-btn");

            // クリックで完了切り替え
            text.addEventListener("click", () => toggleTodo(todo));

            // 編集ボタンで編集モード
            editBtn.addEventListener("click", () => {
                text.style.display = "none";
                editInput.style.display = "block";
                editInput.focus();
            });

            // 編集確定
            editInput.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    const newTitle = editInput.value.trim();
                    if (newTitle) await updateTodo(todo.id, newTitle, todo.completed);
                    fetchTodos();
                }
                if (e.key === "Escape") fetchTodos();
            });

            delBtn.addEventListener("click", () => deleteTodo(todo.id));
            list.appendChild(tr);
        });
    } catch (e) { console.error("Error:", e); }
}

async function addTodo() {
    const input = document.getElementById("todo-input");
    const title = input.value.trim();
    if (!title) return;
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false })
    });
    input.value = "";
    fetchTodos();
}

async function toggleTodo(todo) {
    await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    });
    fetchTodos();
}

async function updateTodo(id, title, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed })
    });
}

async function deleteTodo(id) {
    if (!confirm("本当に削除しますか？")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
}
