<?php
Class IngredientModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getIngredients($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT ingredientId, ingredientName, ingredientPrice, ingredientIsActive, ingredientCreatedate
    FROM ingredients WHERE ingredientIsActive = 1 LIMIT :perPage OFFSET :offset');

        $this->db->bind(':perPage', $perPage);
        $this->db->bind(':offset', $offset);
         return $this->db->resultSet();            
}
public function getTotalActiveIngredienten()
{
    $this->db->query('SELECT COUNT(*) as count FROM ingredients WHERE ingredientIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}

public function delete($ingredientId)
{
    $this->db->query('UPDATE ingredients SET ingredientIsActive = 0 WHERE ingredientId = :ingredientId');
    $this->db->bind(':ingredientId', $ingredientId);
    $this->db->execute();
}

public function getIngredientById($ingredientId) {
    $this->db->query('SELECT ingredientId, ingredientName
    FROM ingredients WHERE ingredientId = :ingredientId');

    $this->db->bind(':ingredientId', $ingredientId);
    $result = $this->db->single();
    
    if ($result) {
        return $result->ingredientName;
    } else {
        return null; 
    }
}

public function create($post)
{
    global $var;
    $this->db->query('INSERT INTO ingredients (ingredientId,
                                            ingredientName,
                                            ingredientPrice,
                                            ingredientCreatedate)
                                            VALUES (:id, :ingredientName, :ingredientPrice, :ingredientCreatedate)');
                                            
    $this->db->bind(':id', $var['rand']);
    $this->db->bind(':ingredientName', $post['ingredientName']);
    $this->db->bind(':ingredientPrice', $post['ingredientPrice']);
    $this->db->bind(':ingredientCreatedate', $var['timestamp']);
    return $this->db->execute();
}

public function getSingleIngredient($ingredientId)
    {
        $this->db->query('SELECT ingredientId,
                                    ingredientName,
                                    ingredientPrice,
                                    ingredientCreatedate
                                    FROM ingredients
                                    WHERE ingredientId = :id');
        $this->db->bind(':id', $ingredientId);
        $row = $this->db->single();
        return $row;
    }
public function update($post)
{
    try {
        $this->db->query('UPDATE ingredients SET ingredientName = :ingredientName,
                                            ingredientPrice = :ingredientPrice
                WHERE ingredientId = :id');
        $this->db->bind(':id', $post['id']);
        $this->db->bind(':ingredientName', $post['ingredientName']);
        $this->db->bind(':ingredientPrice', $post['ingredientPrice']);
        $this->db->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}


}