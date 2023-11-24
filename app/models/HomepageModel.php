<?php
Class HomepageModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getPromos()
{
     $this->db->query("SELECT promotionId, promotionName, promotionStartDate, promotionEndDate, promotionIsActive, promotionCreateDate  
     FROM promotions WHERE promotionIsActive = 1");
     return $this->db->resultSet();    
}

public function getPizzas()
{
    $this->db->query("SELECT productId, productname, productCategory, productPrice, productPath, productIsActive, productCreatedate  
    FROM products WHERE productIsActive = 1 AND productCategory = 'pizza'");
    return $this->db->resultSet();    
}

public function getDrinks()
{
    $this->db->query("SELECT productId, productname, productCategory, productPrice, productPath, productIsActive, productCreatedate  
    FROM products WHERE productIsActive = 1 AND productCategory = 'drinks'");
    return $this->db->resultSet();    
}

public function getSnacks()
{
    $this->db->query("SELECT productId, productname, productCategory, productPrice, productPath, productIsActive, productCreatedate  
    FROM products WHERE productIsActive = 1 AND productCategory = 'snacks'");
    return $this->db->resultSet();    
}

public function getReviews()
    {
        $this->db->query("SELECT r.reviewId,
                                 r.reviewCustomerId,
                                 r.reviewOrderId,
                                 r.reviewRating,
                                 r.reviewText,
                                 c.customerFirstName,
                                 c.customerLastName
                                 FROM reviews as r
                                 INNER JOIN customers as c ON r.reviewCustomerId = c.customerId
                                 INNER JOIN orders as o ON r.reviewOrderId = o.orderId
                                 WHERE reviewIsActive = 1");
        return $this->db->resultSet();
    }
}