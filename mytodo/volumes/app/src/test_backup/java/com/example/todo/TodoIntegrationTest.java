package com.example.todo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// 実際にサーバーを起動してテストする（ランダムなポートを使用）
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TodoIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private TodoRepository todoRepository;

    @Test
    public void testFullFlow() {
        // 1. 新しいToDoをPOST
        Todo newTodo = new Todo();
        newTodo.setTitle("結合テストのタスク");
        newTodo.setCompleted(false);

        ResponseEntity<Todo> response = restTemplate.postForEntity("/api/todos", newTodo, Todo.class);
        
        // 2. 正常に保存されたか検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getId()).isNotNull();
        assertThat(response.getBody().getTitle()).isEqualTo("結合テストのタスク");

        // 3. DBに実際に存在するか確認
        Long id = response.getBody().getId();
        assertThat(todoRepository.findById(id)).isPresent();
    }
}