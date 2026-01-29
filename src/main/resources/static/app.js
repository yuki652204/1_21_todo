
// Nginx(70番)を経由してAPIにアクセスする
const API_URL = "http://localhost:70/api/todos";
let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();

    const input = document.getElementById("todoTitle");
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTodo();
    });

    document.getElementById("addBtn").addEventListener("click", addTodo);
});

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();

        // 未完了を上に、完了済みを下にソート
        todos.sort((a, b) => a.completed - b.completed);

        const list = document.getElementById("todo-list");
        list.innerHTML = "";
        isEditing = false;

        todos.forEach(todo => {
            // li要素として作成（ulの子要素として適切）
            const item = document.createElement("li");
            item.className = `todo-item ${todo.completed ? "completed" : ""}`;

            item.innerHTML = `
                <div class="todo-content">
                    <span class="todo-text">${todo.title}</span>
                    <input class="edit-input" value="${todo.title}" style="display:none;">
                </div>
                <button class="delete-btn" title="削除">×</button>
            `;

            const text = item.querySelector(".todo-text");
            const input = item.querySelector(".edit-input");
            const delBtn = item.querySelector(".delete-btn");

            let clickTimer = null;
            const CLICK_DELAY = 250;

            // --- シングルクリック(完了) vs ダブルクリック(編集) ---
            text.addEventListener("click", () => {
                if (isEditing) return;

                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    enterEditMode(text, input);
                } else {
                    clickTimer = setTimeout(async () => {
                        await toggleTodo(todo);
                        clickTimer = null;
                    }, CLICK_DELAY);
                }
            });

            // --- 編集の確定とキャンセル ---
            input.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    const newTitle = input.value.trim();
                    if (newTitle && newTitle !== todo.title) {
                        await updateTodo(todo.id, newTitle, todo.completed);
                    }
                    isEditing = false;
                    fetchTodos();
                }
                if (e.key === "Escape") {
                    isEditing = false;
                    fetchTodos();
                }
            });

            // --- 削除 ---
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`「${todo.title}」を削除しますか？`)) {
                    deleteTodo(todo.id);
                }
            });

            list.appendChild(item);
        });
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// 共通の入力/更新/削除ロジック（変更なし）
async function addTodo() {
    const input = document.getElementById("todoTitle");
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
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
}

function enterEditMode(text, input) {
    isEditing = true;
    text.style.display = "none";
    input.style.display = "inline-block";
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length); // カーソルを末尾に
}