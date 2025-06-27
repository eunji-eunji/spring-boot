package com.example.secondproject.dto;

import com.example.secondproject.entity.Article;
import lombok.AllArgsConstructor;
import lombok.ToString;

@ToString
@AllArgsConstructor
public class ArticleForm {

    private Long id;
    private String title;
    private String content;

    public Article toEntity(){
        return new Article(id, title, content);
    }
}
