<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set the content type to JSON
header('Content-Type: application/json');

try {
    include 'db_connect.php';

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['name']) || !isset($data['contact']) || !isset($data['email']) || !isset($data['amount'])) {
        throw new Exception('Invalid request data');
    }

    $name = $conn->real_escape_string($data['name']);
    $contact = $conn->real_escape_string($data['contact']);
    $email = $conn->real_escape_string($data['email']);
    $amount = floatval($data['amount']);
    $organization = $conn->real_escape_string($data['organization']);
    $designation = $conn->real_escape_string($data['designation']);
    $frequency = $conn->real_escape_string($data['frequency']);

    $sql = "INSERT INTO donations (name, contact, email, amount, organization, donation_designation, donation_frequency) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sssdiss", $name, $contact, $email, $amount, $organization, $designation, $frequency);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>