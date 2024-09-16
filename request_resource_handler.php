<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $name = $data['name'];
    $contact = $data['contact'];
    $location = json_encode($data['location']);
    $quantity = $data['quantity'];
    $urgency = $data['urgency'];
    $categories = $data['categories'];

    $conn->begin_transaction();

    try {
        foreach ($categories as $category) {
            // Insert request
            $sql = "INSERT INTO request_resources (name, contact, location, type_of_resource, quantity, urgency) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $name, $contact, $location, $category, $quantity, $urgency);
            $stmt->execute();

            // Update resources
            $sql = "UPDATE resources SET quantity = quantity - ? WHERE resource_name = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("is", $quantity, $category);
            $stmt->execute();
        }

        $conn->commit();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request data']);
}

$conn->close();
?>