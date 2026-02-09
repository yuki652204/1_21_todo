package com.example.todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // 日付(date)の昇順(OrderByDateAsc)で取得するメソッドを追加
	List<Todo> findAllByOrderByDateDesc();
}

