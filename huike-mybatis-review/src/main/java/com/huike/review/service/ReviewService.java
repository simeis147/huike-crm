package com.huike.review.service;

import com.huike.review.pojo.Review;
import com.huike.review.vo.MybatisReviewVO;

import java.util.List;

/**
 * mybatis复习接口层
 */
public interface ReviewService {

    /**
     * 插入数据
     * @param name
     * @param age
     * @param sex
     * @return
     */
    String saveData(String name, Integer age, String sex);
}
