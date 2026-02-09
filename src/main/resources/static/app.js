const API_URL = "http://localhost:70/api/todos"; 
let isEditing = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    
    // 登録ボタンとエンターキーのイベント設定
    document.getElementById("todoTitle").addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTodo();
    });
    document.getElementById("addBtn").addEventListener("click", addTodo);
});

// --- 1. データの読み込みと表示 ---
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();

        const list = document.getElementById("todo-list");
        if (!list) return; // リスト要素が見つからない場合は中断
        
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

            // --- 1. 編集モードの起動（ダブルクリック） ---
            taskDetail.addEventListener("dblclick", () => {
                if (isEditing) return;
                enterEditMode(taskDetail, editInput);
            });

            // --- 2. 編集の確定 (Enter) と キャンセル (Escape) ---
            editInput.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    isEditing = false; // 先にフラグを折って blur との競合を防ぐ
                    const newTitle = editInput.value.trim();
                    await updateTodo(todo.id, newTitle, todo.date, todo.name, todo.status);
                    fetchTodos();
                }
                if (e.key === "Escape") {
                    isEditing = false;
                    fetchTodos();
                }
            });

            // --- 3. 枠外クリック（フォーカス喪失）でキャンセル ---
            editInput.addEventListener("blur", () => {
                // Enter確定時の再描画とぶつからないよう少しだけ遅らせる
                setTimeout(() => {
                    if (isEditing) {
                        isEditing = false;
                        fetchTodos();
                    }
                }, 150);
            });

            // --- 4. 削除ボタン ---
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
    const date = document.getElementById("shiftDate").value;
    const name = document.getElementById("staffName").value;
    const status = document.getElementById("shiftStatus").value;
    const title = document.getElementById("todoTitle").value;

    if (!date || !name) {
        alert("日付と名前を入力してください");
        return;
    }

    const payload = {
        date, name, status, title,
        completed: (status === "off") 
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    document.getElementById("staffName").value = "";
    document.getElementById("todoTitle").value = "";
    fetchTodos();
}

// --- 3. APIの更新・削除 ---
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

// --- 4. ユーティリティ ---
function enterEditMode(text, input) {
    isEditing = true;
    text.style.display = "none";
    input.style.display = "inline-block";
    input.focus();
}
