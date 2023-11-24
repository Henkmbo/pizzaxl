<?php
Class VehicleModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getVehicles($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;
    $this->db->query('SELECT v.vehicleId, v.vehicleType, v.vehicleMaintenanceDate, v.vehicleStoreId, v.vehicleIsActive, v.vehicleCreateDate, s.storeName, s.storeId
    FROM vehicles AS v INNER JOIN stores AS s ON v.vehicleStoreId = s.storeId WHERE vehicleIsActive = 1 LIMIT :perPage OFFSET :offset');
      $this->db->bind(':perPage', $perPage);
      $this->db->bind(':offset', $offset);
         return $this->db->resultSet();  
           
}

public function delete($vehicleId)
{
    $this->db->query('UPDATE vehicles SET vehicleIsActive = 0 WHERE vehicleId = :vehicleId');
    $this->db->bind(':vehicleId', $vehicleId);
    $this->db->execute();
}

public function getTotalActiveVehicles()
{
    $this->db->query('SELECT COUNT(*) as count FROM vehicles WHERE vehicleIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}
public function getProductById($vehicleId) {
    $this->db->query('SELECT vehicleId, productName, productOwner
    FROM vehicles WHERE vehicleId = :vehicleId');
    $this->db->bind(':vehicleId', $vehicleId);
    $result = $this->db->single();
    
    if ($result) {
        return $result->productName;
    } else {
        return null; 
    }
}
public function getSingleVehicle($vehicleId)
    {
        $this->db->query('SELECT v.vehicleId,
                                    v.vehicleStoreId,
                                    v.vehicleType,
                                    s.storeName
                                    FROM vehicles as v
                                    INNER JOIN stores as s
                                    ON v.vehicleStoreId = s.storeId
                                    WHERE vehicleId = :id');
        $this->db->bind(':id', $vehicleId);
        $vehicle = $this->db->single();
        // var_dump($vehicle);exit;
        return $vehicle;
    }
    
    public function update($post)
    {
        try {
            $this->db->query('UPDATE vehicles SET vehicleStoreId = :vehicleStoreId,
                                                vehicleType = :vehicleType

                    WHERE vehicleId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':vehicleStoreId', $post['vehicleStoreId']);
            $this->db->bind(':vehicleType', $post['vehicleType']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function create($post)
    {
        global $var;
    
        // Get the current timestamp
        $vehicleCreateDate = $var['timestamp']; // Original Unix timestamp for vehicleCreateDate
        // Calculate the DateTime for vehicleCreateDate
        $dateTimeCreateDate = new DateTime("@$vehicleCreateDate");
        // Add three months to the DateTime
        $dateTimeMaintenanceDate = $dateTimeCreateDate->add(new DateInterval('P9M'));
        // Get the Unix timestamp for vehicleMaintenanceDate
        $vehicleMaintenanceDate = $dateTimeMaintenanceDate->getTimestamp();
    
        // Rest of your code remains unchanged
        $this->db->query('INSERT INTO vehicles (vehicleId, vehicleStoreId, vehicleType, vehicleMaintenanceDate, vehicleCreateDate) VALUES (:id, :vehicleStoreId, :vehicleType, :vehicleMaintenanceDate, :vehicleCreateDate)');
        $this->db->bind(':id', $var['rand']);
        $this->db->bind(':vehicleStoreId', $post['vehicleStoreId']);
        $this->db->bind(':vehicleType', $post['vehicleType']);
        $this->db->bind(':vehicleMaintenanceDate', $vehicleMaintenanceDate);
        $this->db->bind(':vehicleCreateDate', $vehicleCreateDate);
        return $this->db->execute();
    }
    
    
}