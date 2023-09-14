package com.huike.review.controller;

import com.huike.common.core.domain.AjaxResult;
import com.huike.review.service.ReviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/review")
@Slf4j
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/saveData/{name}/{age}/{sex}")
    public AjaxResult saveDataOne(@PathVariable String name, @PathVariable Integer age, @PathVariable String sex){
        log.info("插入数据{}, {}, {}",name,age,sex);
        return AjaxResult.success();
    }

}
