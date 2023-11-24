<?php
Class CustomerModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getCustomers($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT customerId, customerFirstName, customerLastName, customerStreetName, customerCity, customerZipCode, customerPhone, customerEmail, customerType, customerIsActive, Customercreatedate
    FROM customers WHERE customerIsActive = 1 AND customerType = "member" LIMIT :perPage OFFSET :offset');

    $this->db->bind(':perPage', $perPage);
    $this->db->bind(':offset', $offset);

    return $this->db->resultSet();
}

public function getCustomersByPagination($offset, $limit)
{
    $this->db->query('SELECT customerId, customerFirstName, customerLastName, customerStreetName, customerCity, customerZipCode, customerPhone, customerEmail, customerType, customerIsActive, Customercreatedate
    FROM customers WHERE customerIsActive = 1 AND customerType = "member" LIMIT :offset, :limit');

    $this->db->bind(':offset', $offset);
    $this->db->bind(':limit', $limit);
    return $this->db->resultSet();

}

public function getTotalActiveCustomers()
{
    $this->db->query('SELECT COUNT(*) as count FROM customers WHERE customerIsActive = 1 AND customerType = "member"');
    $result = $this->db->single();
    
    return $result->count;
}
public function delete($customerId)
{
    $this->db->query('UPDATE customers SET customerIsActive = 0 WHERE customerId = :customerId');
    $this->db->bind(':customerId', $customerId);
    $this->db->execute();
}

public function getCustomerById($customerId) {
    $this->db->query('SELECT customerId, customerFirstName, customerLastName, customerStreetName, customerCity, customerZipCode, customerPhone, customerEmail, customerType, customerIsActive, Customercreatedate 
    FROM customers WHERE customerId = :customerId');
    $this->db->bind(':customerId', $customerId);
    $result = $this->db->single();
    
    if ($result) {
        return [$result->customerFirstName, $result->customerLastName];
    } else {
        return null; 
    }
}
public function getSingleCustomer($customerId)
    {
        $this->db->query('SELECT customerId,
                                    customerFirstName,
                                    customerLastName,
                                    customerStreetName,
                                    customerCity,
                                    customerZipCode,
                                    customerPhone,
                                    customerEmail,
                                    customerType
                                    FROM customers
                                    WHERE customerId = :id');
        $this->db->bind(':id', $customerId);
        $row = $this->db->single();
        return $row;
    }
    
    public function update($post)
    {
        try {
            $this->db->query('UPDATE customers SET customerFirstName = :customerFirstName,
                                                customerLastName = :customerLastName,
                                                customerStreetName = :customerStreetName,
                                                customerCity = :customerCity,
                                                customerZipCode = :customerZipCode,
                                                customerPhone = :customerPhone,
                                                customerEmail = :customerEmail,
                                                customerType = :customerType
                    WHERE customerId = :id');
            $this->db->bind(':id', $post['id']);
            $this->db->bind(':customerFirstName', $post['customerFirstName']);
            $this->db->bind(':customerLastName', $post['customerLastName']);
            $this->db->bind(':customerStreetName', $post['customerStreetName']);
            $this->db->bind(':customerCity', $post['customerCity']);
            $this->db->bind(':customerZipCode', $post['customerZipCode']);
            $this->db->bind(':customerPhone', $post['customerPhone']);
            $this->db->bind(':customerEmail', $post['customerEmail']);
            $this->db->bind(':customerType', $post['customerType']);
            $this->db->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public function create($post)
    {
        global $var;
        $this->db->query('INSERT INTO customers (customerId,
                                                customerFirstName,
                                                customerLastName,
                                                customerStreetName,
                                                customerZipCode,
                                                customerCity,
                                                customerEmail,
                                                customerPhone,
                                                customerType,
                                                Customercreatedate)
                                                VALUES (:id, :customerfirstname, :customerlastname, :customerstreetname, :customerzipcode, :customercity, :customeremail,
                                                :customerphone, :customertype, :Customercreatedate)');
        $this->db->bind(':id', $var['rand']);
        $this->db->bind(':customerfirstname', $post['customerfirstname']);
        $this->db->bind(':customerlastname', $post['customerlastname']);
        $this->db->bind(':customerstreetname', $post['customerstreetname']);
        $this->db->bind(':customerzipcode', $post['customerzipcode']);
        $this->db->bind(':customercity', $post['customercity']);
        $this->db->bind(':customeremail', $post['customeremail']);
        $this->db->bind(':customerphone', $post['customerphone']);
        $this->db->bind(':customertype', $post['customertype']);
        $this->db->bind(':Customercreatedate', $var['timestamp']);
        return $this->db->execute();
    }
}