<?php
Class OrderModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getOrders($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;
    $this->db->query('SELECT
        o.orderId,
        s.storeName,
        orderState,
        o.orderCustomerId,
        c.customerFirstName,
        o.orderStatus,
        o.orderCreatedate,
        o.orderPrice
        FROM orders AS o
        INNER JOIN stores AS s ON o.orderStoreId = s.storeId
        INNER JOIN customers AS c ON o.orderCustomerId = c.customerId
        LIMIT :perPage OFFSET :offset');

    $this->db->bind(':perPage', $perPage);
    $this->db->bind(':offset', $offset);
    return $this->db->resultSet();
}



public function getProductByOrder($orderId)
    {
        $this->db->query('SELECT o.orderId,
                                 p.productId,
                                 p.productname,
                                 p.productType,
                                 ohp.orderId,
                                 ohp.productId,
                                 ohp.productPrice,
                                 o.orderCreatedate
                                 FROM orderhasproducts as ohp
                                 INNER JOIN orders as o ON ohp.orderId = o.orderId
                                 INNER JOIN products as p ON ohp.productId = p.productId
                                 WHERE ohp.orderId = :orderId');
        $this->db->bind(':orderId', $orderId);
        return $this->db->resultSet();
    }

public function getOrderById($orderId) {
    $this->db->query('SELECT orderId, productName, productOwner
    FROM orders WHERE orderId = :orderId');
    $this->db->bind(':orderId', $orderId);
    $result = $this->db->single();
    
    if ($result) {
        return $result->productName;
    } else {
        return null; 
    }
}
public function getSingleOrder($orderId)
    {
        $this->db->query('SELECT    orderStoreId,
                                    orderId,
                                    orderState,
                                    orderStatus
                                    FROM orders
                                    WHERE orderId = :id');
        $this->db->bind(':id', $orderId);
        $row = $this->db->single();
        return $row;
    }
    public function getTotalActiveOrders()
    {
        $this->db->query('SELECT COUNT(*) AS total_count FROM `orders`');
        $result = $this->db->single();
    
        return $result->total_count;
    }
    

    public function update($post)
    {
        try {
            $this->db->query('UPDATE orders SET orderState = :orderState,
                                                orderStatus = :orderStatus
                    WHERE orderId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':orderState', $post['orderState']);
            $this->db->bind(':orderStatus', $post['orderStatus']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function create($post)
    {
        global $var;

        $this->db->query('INSERT INTO orders (orderId,
                                                orderState,
                                                orderStoreId,
                                                orderCustomerId,
                                                orderStatus,
                                                orderPrice,
                                                orderCreatedate)
                                                VALUES (:id, :orderState, :orderStoreId, :orderCustomerId, :orderStatus, :orderPrice, :orderCreatedate)');
        $this->db->bind(':id', $var['rand']);
        $this->db->bind(':orderState', $post['orderState']);
        $this->db->bind(':orderStoreId', $post['orderStoreId']);
        $this->db->bind(':orderCustomerId', $post['orderCustomerId']);
        $this->db->bind(':orderStatus', $post['orderStatus']);
        $this->db->bind(':orderPrice', $post['orderPrice']);
        $this->db->bind(':orderCreatedate', $var['timestamp']);
        return $this->db->execute();

    }

}