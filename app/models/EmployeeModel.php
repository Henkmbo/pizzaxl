<?php
Class EmployeeModel{

private $db;

public function __construct()
{
    $this->db = new Database;
}

public function getEmployees($page = 1, $perPage = 10)
{
    $offset = ($page - 1) * $perPage;

    $this->db->query('SELECT employeeId, employeeFirstName, employeeLastname, employeeStreetName, employeeCity, employeeZipCode, employeePhone, employeeEmail, employeeRole, employeeIsActive, employeeCreateDate
    FROM employees WHERE employeeIsActive = 1 LIMIT :perPage OFFSET :offset');

$this->db->bind(':perPage', $perPage);
$this->db->bind(':offset', $offset);
return $this->db->resultSet();
}

public function delete($employeeId)
{
    $this->db->query('UPDATE employees SET employeeIsActive = 0 WHERE employeeId = :employeeId');
    $this->db->bind(':employeeId', $employeeId);
    $this->db->execute();
}

public function getEmployeeById($employeeId) {
    $this->db->query('SELECT employeeId, employeeFirstName, employeeLastName, employeeStreetName, employeeCity, employeeZipCode, employeePhone, employeeEmail, employeeRole, employeeIsActive, employeeCreateDate 
    FROM employees WHERE employeeId = :employeeId');
    $this->db->bind(':employeeId', $employeeId);
    $result = $this->db->single();
    
    if ($result) {
        return [$result->employeeFirstName, $result->employeeLastName];
    } else {
        return null; 
    }
}

public function create($post)
{
    global $var;
    $this->db->query('INSERT INTO employees (employeeId,
                                            employeeFirstName,
                                            employeeLastName,
                                            employeeStreetName,
                                            employeeCity,
                                            employeeZipCode,
                                            employeePhone,
                                            employeeEmail,
                                            employeeRole,
                                            employeeCreateDate)
                                            VALUES (:id, :employeeFirstName, :employeeLastName, :employeeStreetName, :employeeCity, :employeeZipCode, :employeePhone,
                                            :employeeEmail, :employeeRole, :employeeCreateDate)');
    $this->db->bind(':id', $var['rand']);
    $this->db->bind(':employeeFirstName', $post['employeeFirstName']);
    $this->db->bind(':employeeLastName', $post['employeeLastName']);
    $this->db->bind(':employeeStreetName', $post['employeeStreetName']);
    $this->db->bind(':employeeCity', $post['employeeCity']);
    $this->db->bind(':employeeZipCode', $post['employeeZipCode']);
    $this->db->bind(':employeePhone', $post['employeePhone']);
    $this->db->bind(':employeeEmail', $post['employeeEmail']);
    $this->db->bind(':employeeRole', $post['employeeRole']);
    $this->db->bind(':employeeCreateDate', $var['timestamp']);
    return $this->db->execute();
}

public function getTotalActiveEmployees(){
    $this->db->query('SELECT COUNT(*) as count FROM employees WHERE employeeIsActive = 1');
    $result = $this->db->single();
    
    return $result->count;
}

public function getSingleEemployee($employeeId)
    {
        $this->db->query('SELECT employeeId,
                                    employeeFirstName,
                                    employeeLastName,
                                    employeeStreetName,
                                    employeeCity,
                                    employeeZipCode,
                                    employeePhone,
                                    employeeEmail,
                                    employeeRole
                                    FROM employees
                                    WHERE employeeId = :id');
        $this->db->bind(':id', $employeeId);
        $row = $this->db->single();
        return $row;
    }
public function update($post)
{
    try {
        $this->db->query('UPDATE employees SET employeeFirstName = :employeeFirstName,
                                            employeeLastname = :employeeLastname,
                                            employeeStreetName = :employeeStreetName,
                                            employeeCity = :employeeCity,
                                            employeeZipCode = :employeeZipCode,
                                            employeePhone = :employeePhone,
                                            employeeEmail = :employeeEmail,
                                            employeeRole = :employeeRole
                WHERE employeeId = :id');
        $this->db->bind(':id', $post['id']);
        $this->db->bind(':employeeFirstName', $post['employeeFirstName']);
        $this->db->bind(':employeeLastName', $post['employeeLastName']);
        $this->db->bind(':employeeStreetName', $post['employeeStreetName']);
        $this->db->bind(':employeeCity', $post['employeeCity']);
        $this->db->bind(':employeeZipCode', $post['employeeZipCode']);
        $this->db->bind(':employeePhone', $post['employeePhone']);
        $this->db->bind(':employeeEmail', $post['employeeEmail']);
        $this->db->bind(':employeeRole', $post['employeeRole']);
        $this->db->execute();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}

public function getManagers()
{
    $this->db->query('SELECT employeeFirstName, employeeId
    FROM employees
    WHERE employeeRole = "Manager"');
}


public function insertEmployeeImg($fileInput, $employeeId, $screenEntity)
{
    global $var;

    // Check if the file is uploaded successfully
    if ($fileInput['error'] === UPLOAD_ERR_OK) {
        // Generate a unique filename for the uploaded file
        $fileName = $var['rand'] . '.png';  // Include the file extension
        // Define the base destination directory
        $baseDestination = 'public/media/';

        // Get the current date in the "YYYY-MM-DD" format
        $newdate = date("Ymd");
        

        // Check if the directory with the current date exists
        $dateFolder = $baseDestination . $newdate;
        if (!file_exists($dateFolder)) {
            // If it doesn't exist, create the directory
            mkdir($dateFolder, 0777, true);
        }

        // Set the destination path
        $destination = $dateFolder . '/' . $fileName;

        // Move the uploaded file to the destination directory
        move_uploaded_file($fileInput['tmp_name'], $destination);

        // Insert the image information into the database
        $this->db->query('INSERT INTO screens (screenId, screanCreateDate, screanEntityId, screenEntity) VALUES (:id, :screanCreateDate, :screanEntityId, :screenEntity)');
$this->db->bind(':id', $fileName);  // Use the filename without the directory
$this->db->bind(':screanCreateDate', $var['timestamp']);
$this->db->bind(':screanEntityId', $employeeId);
$this->db->bind(':screenEntity', $screenEntity);
$this->db->execute();
        return $destination; // Return the path to the saved image
    } else {
        // Handle file upload errors as needed
        return false;
    }
}


// Inside your model
public function getEmployeeImage($employeeId)
{
    $this->db->query('SELECT screenId, screanCreateDate FROM screens WHERE screanEntityId = :employeeId AND screanIsActive = 1');
    $this->db->bind(':employeeId', $employeeId);
    
    $result = $this->db->single();

    if ($result) {
        // Construct the image path with the extension
        $imagePath = 'public/media/' . date('Ymd') . '/' . $result->screenId . '.png';

        // Check if the file exists
        if (file_exists($imagePath)) {
            return $imagePath;
            
        }
    }

    return null;
}
public function deleteProfileImg($screenId)
{
    $this->db->query('UPDATE screens SET screanIsActive = 0 WHERE screenId = :screenId');
    $this->db->bind(':screenId', $screenId);
    $this->db->execute();
}

public function getScreenDataById($entityId, $entity, $scope)
    {
        $this->db->query("SELECT screenId, screenEntity, screanCreateDate FROM screens WHERE screanEntityId = :screanEntityId AND screenEntity = :screenEntity AND screenScope = :screenScope AND screanIsActive = 1");
        $this->db->bind(':screanEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);
        $this->db->bind(':screenScope', $scope);
        return $this->db->single();
    }

}