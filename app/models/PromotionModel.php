<?php
Class PromotionModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getPromotions($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT promotionId, promotionName, promotionStartDate, promotionEndDate, promotionIsActive, promotionCreateDate
    FROM promotions
    WHERE promotionIsActive = 1 LIMIT :perPage OFFSET :offset');
         $this->db->bind(':perPage', $perPage);
         $this->db->bind(':offset', $offset);
    return $this->db->resultSet();  
           
}

public function delete($promotionId)
{
    $this->db->query('UPDATE promotions SET promotionIsActive = 0 WHERE promotionId = :promotionId');
    $this->db->bind(':promotionId', $promotionId);
    $this->db->execute();
}
 
public function getTotalActivePromotions()
{
    $this->db->query('SELECT COUNT(*) as count FROM promotions WHERE promotionIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}
public function getSinglePromotion($promotionId)
    {
        
        $this->db->query('SELECT promotionId,
                                    promotionName,
                                    promotionStartDate,
                                    promotionEndDate
                                    FROM promotions
                                    WHERE promotionId = :id');
        $this->db->bind(':id', $promotionId);
        $row = $this->db->single();
        return $row;
    }
    public function update($post)
    {
        $promotionStartDate = strtotime($post["promotionStartDate"]);
        $promotionEndDate = strtotime($post["promotionEndDate"]);
        try {
            $this->db->query('UPDATE promotions SET promotionName = :promotionName,
                                                promotionStartDate = :promotionStartDate,
                                                promotionEndDate = :promotionEndDate
                    WHERE promotionId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':promotionName', $post['promotionName']);
            $this->db->bind(':promotionStartDate', $promotionStartDate);
            $this->db->bind(':promotionEndDate', $promotionEndDate);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    public function create($post)
{
    global $var;

    $promotionStartDate = strtotime($post["promotionStartDate"]);
    $promotionEndDate = strtotime($post["promotionEndDate"]);
    $this->db->query('INSERT INTO promotions (promotionId,
                                            promotionName,
                                            promotionStartDate,
                                            promotionEndDate,
                                            promotionCreateDate)
                                            VALUES (:id, :promotionName, :promotionStartDate, :promotionEndDate, :promotionCreateDate)');
    $this->db->bind(':id', $var['rand']);
    $this->db->bind(':promotionName', $post['promotionName']);
    $this->db->bind(':promotionStartDate', $promotionStartDate);
    $this->db->bind(':promotionEndDate', $promotionEndDate);
    $this->db->bind(':promotionCreateDate', $var['timestamp']);

    return $this->db->execute();
}

}