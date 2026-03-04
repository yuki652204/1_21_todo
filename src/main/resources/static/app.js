const API_URL = "/api/todos";//JSが、**「http://localhost:70/api/todos」という文字列（サーバーの住所）**を、定数API_URLに代入した
let isEditing = false;
//JSが、**「今は編集中ではない」という状態（false）**を、変数isEditing（信号機）に代入した
document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
    //JSが、**document（HTML全体のオブジェクト）に対し、「HTMLの読み込みがすべて完了（DOMContentLoaded）した」ら動くようにお願い（予約）**した。
    // 登録ボタンとエンターキーのイベント設定
	
    document.getElementById("todoTitle").addEventListener("keypress", (e) => {
		////JSが、**「todoTitle」というIDを持つ入力欄（オブジェクト）をHTMLから探し出し、その部品に対して「キーが押されている間（keypress）」に動くようにお願い（予約）**した。
        if (e.key === "Enter") addTodo();
		//（キーが押された時）JSが、押されたキー（e.key）が「Enter」かどうかを判定し、**「Enter」であれば addTodo 関数を呼び出し（実行）**した。
    });
	
    document.getElementById("addBtn").addEventListener("click", addTodo);
});
//JSが、**「addBtn」というIDを持つ登録ボタン（オブジェクト）をHTMLから探し出し、その部品に対して「クリック（click）」されたら addTodo 関数を動かすようにお願い（予約）**した。

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
           
			// 修正後（statusがoff、または completedがtrue のどちらでも線を引く）
			item.className = `todo-item ${(todo.status === "off" || todo.completed) ? "completed" : ""}`;
			
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

			//削除ボタン
            delBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`${todo.name}さんのデータを削除しますか？`)) deleteTodo(todo.id);
            };
			//JSが、**delBtn（借りてきたボタンオブジェクト）**の、**onclickというプロパティ（予約表）**にアクセスした。
			//JSが、その予約表に**「クリックされた時に実行する処理」**を、**代入（セット）**した。
			//delBtnが、**e（クリックされた時の状況データ）**を受け取り、**e.stopPropagation()（他の場所への影響を止める）**というお願いを実行した。
			//delBtnが、confirm（確認ダイアログ）を出し、「OK」が押された場合のみ deleteTodo 関数を**呼び出し（リクエスト）**した。

            list.appendChild(item);
        });
		
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// --- 2. APIへの新規登録 ---
async function addTodo() {
    const nameEl = document.getElementById("staffName");
    const dateEl = document.getElementById("shiftDate");
    
    const name = nameEl.value;
    const date = dateEl.value;
    const status = document.getElementById("shiftStatus").value;
    const title = document.getElementById("todoTitle").value;

    // --- エラー表示の強化 ---
    if (!date || !name) {
        if (!date) dateEl.style.border = "2px solid red"; 
        if (!name) nameEl.style.border = "2px solid red"; 
        
        alert("赤枠の項目を入力してください");
        return; // 入力不足ならここで終了
    }

    // 入力されていたら枠を元に戻す
    dateEl.style.border = "";
    nameEl.style.border = "";

    const payload = {
        date, name, status, title,
        completed: (status === "off") 
    };

    // fetch処理をasync関数(addTodo)の中に正しく収めます
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        document.getElementById("staffName").value = "";
        document.getElementById("todoTitle").value = "";
        fetchTodos();
    } catch (error) {
        console.error("Post Error:", error);
    }
} // ← ここでaddTodo関数を閉じる

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
