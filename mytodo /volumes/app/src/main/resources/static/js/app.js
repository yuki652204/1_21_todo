// シングルクリックとダブルクリックを判別するためのタイマー変数
let clickTimer = null; 

/**
 * 1. Todo一覧をサーバーから取得して画面に表示する関数
 */
async function fetchTodos() {
    // サーバーのAPI（GET）からデータを取得
    const response = await fetch('/api/todos');
    const todos = await response.json();
    
    // 表示場所のHTML要素を空にする
    const listElement = document.getElementById('todo-list');
    listElement.innerHTML = '';
    //一つ以上ならないように
	listElement.innerHTML = ''; 

	    todos.forEach(todo => {
	        // ... ここで1件ずつ追加する処理 ...
	    });
	
    // 取得したTodoデータを1件ずつ処理
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.className = 'todo-item';
        
        // 完了済みならCSSクラス 'completed' を付与（打ち消し線用）
        const titleClass = todo.completed ? 'completed' : '';
        
        // 各TodoのHTMLを組み立て
        item.innerHTML = `
            <button class="btn-del" onclick="event.stopPropagation(); deleteTodo(${todo.id})">削除</button>
            <div id="todo-text-${todo.id}" 
                 class="${titleClass}" 
                 onclick="handleSingleClick(${todo.id}, ${todo.completed}, '${todo.title}')"
                 ondblclick="handleDoubleClick(event, ${todo.id}, '${todo.title}')">
                ${todo.title}
            </div>
        `;
        listElement.appendChild(item);
    });
}

/**
 * 2. シングルクリック（完了トグル）の判定処理
 */
function handleSingleClick(id, currentStatus, title) {
    // もし前に予約されたクリックがあればキャンセルする（連打対策）
    clearTimeout(clickTimer);
    
    // 300ミリ秒だけ待機。この間にダブルクリックが来なければ実行する
    clickTimer = setTimeout(() => {
        toggleTodo(id, currentStatus, title);
    }, 300);
}

/**
 * 3. ダブルクリック（編集開始）の判定処理
 */
function handleDoubleClick(event, id, currentTitle) {
    // ダブルクリックが成立したので、待機中だったシングルクリックを中止する
    clearTimeout(clickTimer);
    
    // 親要素へのクリックイベント伝播を止める
    event.stopPropagation();
    
    // 編集モード（入力欄表示）へ移行
    startEdit(id, currentTitle);
}

/**
 * 4. 画面をテキストから「入力欄」に切り替える関数
 */
function startEdit(id, currentTitle) {
    const todoElement = document.getElementById(`todo-text-${id}`);
    
    // テキスト部分を input 要素に書き換える
    todoElement.innerHTML = `
        <input type="text" id="input-${id}" class="edit-input" value="${currentTitle}" 
               onclick="event.stopPropagation()" 
               onkeydown="handleUpdate(event, ${id})">
    `;
    
    // 生成した入力欄を取得し、自動的にフォーカス（カーソル）を合わせる
    const input = document.getElementById(`input-${id}`);
    input.focus();
    
    // カーソルを文字の最後（末尾）に移動させる
    input.setSelectionRange(currentTitle.length, currentTitle.length);
}

/**
 * 5. 入力中にキーが押された時の処理（Enterで保存 / Escで中止）
 */
async function handleUpdate(event, id) {
    if (event.keyCode === 13) { // Enterキーが押された場合
        const newTitle = event.target.value;
        
        // タイトルが空でなければサーバーへ保存（PUT）
        if (newTitle.trim()) {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, completed: false }) 
            });
        }
        // 保存後に再描画して元のテキスト表示に戻す
        fetchTodos();
        
    } else if (event.keyCode === 27) { // Escキーが押された場合
        // 何もせず再描画して編集をキャンセル
        fetchTodos();
    }
}

/**
 * 6. 完了/未完了の状態を反転させる関数
 */
async function toggleTodo(id, currentStatus, title) {
    // 入力欄が開いている間は、誤作動防止のため実行しない
    if (document.getElementById(`input-${id}`)) return;

    await fetch(`/api/todos/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // 現在のステータスを反転（!）させて送信
        body: JSON.stringify({ title: title, completed: !currentStatus })
    });
    fetchTodos();
}

/**
 * 7. 新しいTodoを追加する関数
 */
async function addTodo() {
    const input = document.getElementById('todoTitle');
    if (!input.value.trim()) return; // 空なら何もしない

    await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value, completed: false })
    });
    
    input.value = ''; // 入力欄をクリア
    fetchTodos();    // 一覧更新
}

/**
 * 8. Todoを削除する関数
 */
async function deleteTodo(id) {
    if (!confirm('本当に削除しますか？')) return;
    
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos(); // 一覧更新
}

// ページを読み込んだ瞬間に、最初のTodo一覧を表示する
fetchTodos();