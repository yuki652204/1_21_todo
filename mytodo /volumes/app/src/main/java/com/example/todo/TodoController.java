package com.example.todo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoRepository repository; // 名前を repository に統一します

    @GetMapping
    public List<Todo> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return repository.save(todo);
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        // repository を使って検索
        Todo todo = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        // タイトルが送られてきた場合のみ更新（インライン編集用）
        if (todoDetails.getTitle() != null) {
            todo.setTitle(todoDetails.getTitle());
        }
        
        // 完了状態の更新
        todo.setCompleted(todoDetails.isCompleted());

        return repository.save(todo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}