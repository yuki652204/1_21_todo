package com.example.todo;
import org.springframework.data.jpa.repository.JpaRepository; // 基本的なDB操作機能を持つクラスをインポート
import org.springframework.stereotype.Repository;             // Springにリポジトリとして登録

@Repository // このクラスがDB操作を担う「貯蔵庫」であることを示す
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // JpaRepositoryを継承するだけで、findAll()やsave()が自動的に使えるようになります
}