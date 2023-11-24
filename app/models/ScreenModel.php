<?php
class ScreenModel
{
    private $db;
    public function __construct()
    {
        $this->db = new Database();
    }
    public function getScreenByEntityId($entityId)
    {
        $this->db->query("SELECT * FROM screens WHERE screenEntityId = :entityId");
        $this->db->bind(':entityId', $entityId);
        return $this->db->single();
    }
    public function insertScreenImages($screenId, $entityId, $entity)
    {
        global $var;
        $existingScreen = $this->getScreenByEntityId($entityId);
        if ($existingScreen) {
            // Update the existing screen to isActive = 0
            $this->updateScreenIsActive($existingScreen->screenId, 0);
        }

        // Insert the new screen
        $this->db->query("INSERT INTO screens (screenId,
        screenEntityId,
        screenEntity,
        screenCreateDate,
        screenIsActive)
VALUES (:id, :screenEntityId, :screenEntity, :screenCreateDate, 1)");
        $this->db->bind(':id', $screenId);
        $this->db->bind(':screenEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);
        $this->db->bind(':screenCreateDate', $var['timestamp']);
        $this->db->execute();
    }
    public function insertScreenImagesScope($screenId, $entityId, $entity, $post)
    {
        global $var;

        // Insert the new screen
        $this->db->query("INSERT INTO screens (screenId,
        screenEntityId,
        screenEntity,
        screenScope,
        screenCreateDate,
        screenIsActive)
VALUES (:id, :screenEntityId, :screenEntity, :screenScope, :screenCreateDate, 1)");
        $this->db->bind(':id', $screenId);
        $this->db->bind(':screenEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);
        $this->db->bind(':screenScope', $post['scope']); // Voeg de scope toe aan de database-query
        $this->db->bind(':screenCreateDate', $var['timestamp']);
        $this->db->execute();
    }
    public function getScreenDataById($entityId, $entity)
    {
        $this->db->query("SELECT screenId, screenEntity, screenScope, screenCreateDate FROM screens WHERE screenEntityId = :screenEntityId AND screenEntity = :screenEntity AND screenIsActive = 1");
        $this->db->bind(':screenEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);

        return $this->db->single(); // Use resultSet() for multiple rows
    }

    public function getScreensDataById($entityId, $entity)
    {
        $this->db->query("SELECT screenId, screenEntity, screenScope, screenCreateDate FROM screens WHERE screenEntityId = :screenEntityId AND screenEntity = :screenEntity AND screenIsActive = 1");
        $this->db->bind(':screenEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);

        return $this->db->resultSet(); // Use resultSet() for multiple rows
    }

    public function getImagesByScope($entityId, $entity, $scope)
    {
        $this->db->query("SELECT screenId, screenEntity, screenEntityId, screenScope FROM screens WHERE screenEntityId = :screenEntityId AND screenEntity = :screenEntity AND screenScope = :screenScope AND screenIsActive = 1");
        $this->db->bind(':screenEntityId', $entityId);
        $this->db->bind(':screenEntity', $entity);
        $this->db->bind(':screenScope', $scope);

    }

    public function deleteScreen($screenId)
    {
        $this->db->query("UPDATE screens SET screenIsActive = 0 WHERE screenId = :screenId");
        $this->db->bind(':screenId', $screenId);
        $this->db->execute();
    }
    public function updateScreenIsActive($screenId, $isActive)
    {
        $this->db->query("UPDATE screens SET screenIsActive = :isActive WHERE screenId = :screenId");
        $this->db->bind(':isActive', $isActive);
        $this->db->bind(':screenId', $screenId);
        $this->db->execute();
    }

    public function updateScreenScope($screenId, $scope)
    {
        $this->db->query("UPDATE screens SET screenScope = :screenScope WHERE screenId = :screenId");
        $this->db->bind(':screenScope', $scope);
        $this->db->bind(':screenId', $screenId);

        return $this->db->execute();
    }
}
