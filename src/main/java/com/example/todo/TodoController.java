package com.example.todo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping
    public List<Todo> getAllTodos() {
        
    	return todoRepository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable("id") Long id, @RequestBody Todo todoDetails) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        
     // --- ここを新しいフィールドに対応させる ---
        todo.setDate(todoDetails.getDate());       // 日付を更新
        todo.setName(todoDetails.getName());       // 名前を更新
        todo.setStatus(todoDetails.getStatus());   // ステータスを更新
        
        // JSから届いた編集内容（タイトル）を反映
        todo.setTitle(todoDetails.getTitle());
//        boolean（真偽値）の項目だけは、Getterの名前を get... ではなく is... にするという特別なルール（JavaBeans規約）がある
        todo.setCompleted(todoDetails.isCompleted()); 
        
        return todoRepository.save(todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable("id") Long id) {
        todoRepository.deleteById(id);
    }
}