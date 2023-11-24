<?php
Class ProductModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getProducts($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT p.productId, p.productname, p.productType, p.productPrice, p.productOwner, p.productIsActive, p.productCreatedate, c.customerFirstName
    FROM products AS p INNER JOIN customers AS c ON p.productOwner = c.customerId WHERE productIsActive = 1 LIMIT :perPage OFFSET :offset');

     $this->db->bind(':perPage', $perPage);
     $this->db->bind(':offset', $offset);
         return $this->db->resultSet();  
           
}

public function delete($productId)
{
    $this->db->query('UPDATE products SET productIsActive = 0 WHERE productId = :productId');
    $this->db->bind(':productId', $productId);
    $this->db->execute();
}


public function getProductById($productId) {
    $this->db->query('SELECT productId, productName, productOwner
    FROM products WHERE productId = :productId');
    $this->db->bind(':productId', $productId);
    $result = $this->db->single();
    
    if ($result) {
        return $result->productName;
    } else {
        return null; 
    }
}
public function getSingleProduct($productId)
    {
        $this->db->query('SELECT p.productId,
                                    p.productname,
                                    p.productType,
                                    p.productPrice,
                                    p.productOwner,
                                    c.customerFirstName
                                    FROM products as p
                                    INNER JOIN customers as c
                                    ON p.productOwner = c.customerId
                                    WHERE productId = :id');
        $this->db->bind(':id', $productId);
        $row = $this->db->single();
        return $row;
    }
    
    public function getTotalActiveProducts()
    {
        $this->db->query('SELECT COUNT(*) as count FROM products WHERE productIsActive = 1');
        $result = $this->db->single();
        
        return $result->count;
    }

    public function update($post)
    {
        try {
            $this->db->query('UPDATE products SET productname = :productname,
                                                productType = :productType,
                                                productPrice = :productPrice,
                                                productOwner = :productOwner
                    WHERE productId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':productname', $post['productname']);
            $this->db->bind(':productType', $post['productType']);
            $this->db->bind(':productPrice', $post['productPrice']);
            $this->db->bind(':productOwner', $post['productOwner']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function create($post)
    {
        global $var;
        $this->db->query('INSERT INTO products (productId,
                                                productname,
                                                productType,
                                                productPrice,
                                                productOwner,
                                                productCreatedate)
                                                VALUES (:id, :productname, :productType, :productPrice, :productOwner, :productCreatedate)');
        $this->db->bind(':id', $var['rand']);
        $this->db->bind(':productname', $post['productname']);
        $this->db->bind(':productType', $post['productType']);
        $this->db->bind(':productPrice', $post['productPrice']);
        $this->db->bind(':productOwner', $post['productOwner']);
        $this->db->bind(':productCreatedate', $var['timestamp']);
        return $this->db->execute();
    }


}