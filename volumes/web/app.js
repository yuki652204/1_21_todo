const API_URL = "http://localhost:7080/api/todos"; 
let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    
    // 登録ボタンとエンターキーのイベント設定
    const todoTitleInput = document.getElementById("todoTitle");
    const addBtn = document.getElementById("addBtn");

    if (todoTitleInput) {
        todoTitleInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addTodo();
        });
    }

    if (addBtn) {
        addBtn.addEventListener("click", addTodo);
    }
});

// --- 1. データの読み込みと表示 ---
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();

        const list = document.getElementById("todo-list");
        if (!list) return;
        
        list.innerHTML = "";
        isEditing = false;

        todos.forEach(todo => {
            const item = document.createElement("li");
            item.className = `todo-item ${todo.status === "off" ? "completed" : ""}`;

            item.innerHTML = `
                <div class="todo-content">
                    <div class="todo-text">
                        <strong>${todo.date}</strong> | ${todo.name} 
                        <span class="status-badge ${todo.status}">${todo.status === 'work' ? '出勤' : '休み'}</span>
                        <div class="task-detail">${todo.title || "（作業内容なし）"}</div>
                    </div>
                    <input class="edit-input" value="${todo.title || ''}" style="display:none;">
                </div>
                <button class="delete-btn" title="削除">×</button>
            `;

            const editInput = item.querySelector(".edit-input");
            const taskDetail = item.querySelector(".task-detail");
            const delBtn = item.querySelector(".delete-btn");

            taskDetail.addEventListener("dblclick", () => {
                if (isEditing) return;
                enterEditMode(taskDetail, editInput);
            });

            editInput.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    isEditing = false;
                    const newTitle = editInput.value.trim();
                    await updateTodo(todo.id, newTitle, todo.date, todo.name, todo.status);
                    fetchTodos();
                }
                if (e.key === "Escape") {
                    isEditing = false;
                    fetchTodos();
                }
            });

            editInput.addEventListener("blur", () => {
                setTimeout(() => {
                    if (isEditing) {
                        isEditing = false;
                        fetchTodos();
                    }
                }, 150);
            });

            delBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`${todo.name}さんのデータを削除しますか？`)) deleteTodo(todo.id);
            };

            list.appendChild(item);
        });
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// --- 2. APIへの新規登録 ---
async function addTodo() {
    const dateField = document.getElementById("shiftDate");
    const nameField = document.getElementById("staffName");
    const statusField = document.getElementById("shiftStatus");
    const titleField = document.getElementById("todoTitle");

    if (!dateField || !nameField) return;

    const date = dateField.value;
    const name = nameField.value;
    const status = statusField.value;
    const title = titleField.value;

    if (!date || !name) {
        alert("日付と名前を入力してください");
        return;
    }

    const payload = {
        date, name, status, title,
        completed: (status === "off") 
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            nameField.value = "";
            titleField.value = "";
            fetchTodos();
        } else {
            console.error("Registration failed");
        }
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

async function updateTodo(id, title, date, name, status) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, name, status, completed: (status === "off") })
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
}
