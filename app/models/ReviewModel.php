<?php
Class ReviewModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getReviews($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT r.reviewId, r.reviewCustomerId, reviewDescription, r.reviewRating, r.reviewEntityId, r.reviewIsActive, r.reviewCreateDate, c.customerFirstName, customerlastname
    FROM reviews AS r
    INNER JOIN customers 
    AS c
    ON r.reviewCustomerId = c.customerId
     WHERE reviewIsActive = 1 LIMIT :perPage OFFSET :offset');
      $this->db->bind(':perPage', $perPage);
      $this->db->bind(':offset', $offset);
         return $this->db->resultSet();  
           
}
public function getTotalActiveReviews()
{
    $this->db->query('SELECT COUNT(*) as count FROM reviews WHERE reviewIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}
public function delete($reviewId)
{
    $this->db->query('UPDATE reviews SET reviewIsActive = 0 WHERE reviewId = :reviewId');
    $this->db->bind(':reviewId', $reviewId);
    $this->db->execute();
}

public function getSingleReview($reviewId)
    {
        $this->db->query('SELECT reviewId,
                                    reviewRating,
                                    reviewDescription
                                    FROM reviews
                                    WHERE reviewId = :id');
        $this->db->bind(':id', $reviewId);
        $row = $this->db->single();
        return $row;
    }

    public function update($post)
    {
        try {
            $this->db->query('UPDATE reviews SET reviewRating = :reviewRating,
                                                reviewDescription = :reviewDescription
                    WHERE reviewId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':reviewRating', $post['reviewRating']);
            $this->db->bind(':reviewDescription', $post['reviewDescription']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function create($post)
    {
        global $var;
        $this->db->query('INSERT INTO reviews (reviewId,
                                                reviewCustomerId,
                                                reviewRating,
                                                reviewEntityId,
                                                reviewEntity,
                                                reviewDescription,
                                                reviewCreateDate)
                                                VALUES (:id, :reviewCustomerId, :reviewRating, :reviewEntityId, :reviewEntity, :reviewDescription, :reviewCreateDate)');
        $this->db->bind(':id', $var['rand']);
        $this->db->bind(':reviewCustomerId', $post['reviewCustomerId']);
        $this->db->bind(':reviewRating', $post['reviewRating']);
        $this->db->bind(':reviewEntityId', $post['reviewEntityId']);
        $this->db->bind(':reviewEntity', $post['reviewEntity']);
        $this->db->bind(':reviewDescription', $post['reviewDescription']);
        $this->db->bind(':reviewCreateDate', $var['timestamp']);
        return $this->db->execute();
    }
}
