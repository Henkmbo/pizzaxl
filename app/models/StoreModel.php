<?php
Class StoreModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getStores($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;
    $this->db->query('SELECT storeId, storeName, storeStreetName, storeCity, storePhone, storeEmail, storeManager, storeZipcode, storeIsActive, storeCreateDate 
    FROM stores WHERE storeIsActive = 1 LIMIT :perPage OFFSET :offset');
     $this->db->bind(':perPage', $perPage);
     $this->db->bind(':offset', $offset);
         return $this->db->resultSet();  
           
}
public function create($post)
{
    global $var;
    $this->db->query('INSERT INTO stores (storeId,
                                            storeName,
                                            storeStreetName,
                                            storeCity,
                                            storePhone,
                                            storeEmail,
                                            storeManager,
                                            storeZipcode,
                                            storeCreateDate)
                                            VALUES (:id, :storeName, :storeStreetName, :storeCity, :storePhone, :storeEmail, :storeManager, :storeZipcode, :storeCreateDate)');
    $this->db->bind(':id', $var['rand']);
    $this->db->bind(':storeName', $post['storeName']);
    $this->db->bind(':storeStreetName', $post['storeStreetName']);
    $this->db->bind(':storeCity', $post['storeCity']);
    $this->db->bind(':storePhone', $post['storePhone']);
    $this->db->bind(':storeEmail', $post['storeEmail']);
    $this->db->bind(':storeManager', $post['storeManager']);
    $this->db->bind(':storeZipcode', $post['storeZipcode']);
    $this->db->bind(':storeCreateDate', $var['timestamp']);
    return $this->db->execute();
}
public function getTotalActiveStores()
{
    $this->db->query('SELECT COUNT(*) as count FROM stores WHERE storeIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}

public function delete($storeId)
{
    $this->db->query('UPDATE stores SET storeIsActive = 0 WHERE storeId = :storeId');
    $this->db->bind(':storeId', $storeId);
    $this->db->execute();
}



public function getStoreById($storeId) {
    $this->db->query('SELECT storeId, storeName
    FROM stores WHERE storeId = :storeId');
    $this->db->bind(':storeId', $storeId);
    $result = $this->db->single();
    
    if ($result) {
        return $result->storeName;
    } else {
        return null; 
    }
}

public function getSingleStore($storeId)
    {
        $this->db->query('SELECT storeId,
                                    storeName,
                                    storeStreetName,
                                    storeCity,
                                    storePhone,
                                    storeEmail,
                                    storeZipcode 
                                    FROM stores
                                    WHERE storeId = :id');
        $this->db->bind(':id', $storeId);
        $row = $this->db->single();
        return $row;
    }
    public function update($post)
    {
        try {
            $this->db->query('UPDATE stores SET storeName = :storeName,
                                                storeStreetName = :storeStreetName,
                                                storeCity = :storeCity,
                                                storePhone = :storePhone,
                                                storeEmail = :storeEmail,
                                                storeZipcode = :storeZipcode
                    WHERE storeId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':storeName', $post['storeName']);
            $this->db->bind(':storeStreetName', $post['storeStreetName']);
            $this->db->bind(':storeCity', $post['storeCity']);
            $this->db->bind(':storePhone', $post['storePhone']);
            $this->db->bind(':storeEmail', $post['storeEmail']);
            $this->db->bind(':storeZipcode', $post['storeZipcode']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function getEmployeeByStore($storeId)
    {
        $this->db->query('SELECT s.storeId,
                                 e.employeeId,
                                 e.employeeFirstName,
                                 e.employeeLastname,
                                 e.employeeEmail,
                                 e.employeeRole,
                                 e.employeeCreateDate,
                                 she.employeeId,
                                 she.storeId
                                 FROM storehasemployees as she
                                 INNER JOIN stores as s ON she.storeId = s.storeId
                                 INNER JOIN employees as e ON she.employeeId = e.employeeId
                                 WHERE she.storeId = :storeId');
        $this->db->bind(':storeId', $storeId);
        return $this->db->resultSet();
    }

    public function getVehicleByStore($storeId)
    {
        $this->db->query('SELECT s.storeId,
                                 v.vehicleId,
                                 v.vehicleType,
                                 v.vehicleStoreId,
                                 v.vehicleMaintenanceDate,
                                 v.vehicleCreateDate
                                 FROM stores as s
                                 INNER JOIN vehicles as v ON v.vehicleStoreId = s.storeId
                                 WHERE v.vehicleStoreId = :storeId');
        $this->db->bind(':storeId', $storeId);
        return $this->db->resultSet();
    }
}