<?php
include 'db_connect.php';
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['name']) || !isset($data['contact'])) {
        throw new Exception('Invalid request data');
    }

    $name = $conn->real_escape_string($data['name']);
    $contact = $conn->real_escape_string($data['contact']);
    $location = $conn->real_escape_string($data['location']);
    $flexibleSchedule = $data['flexibleSchedule'] ? 1 : 0;
    $availableDays = $conn->real_escape_string(implode(',', $data['availableDays']));
    $availableTimes = $conn->real_escape_string($data['availableTimes']);
    $skills = $conn->real_escape_string(implode(',', $data['skills']));
    $additionalSkills = $conn->real_escape_string($data['additionalSkills']);

    $sql = "INSERT INTO volunteers (name, contact, location, flexible_schedule, available_days, available_times, skills, additional_skills) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sssissss", $name, $contact, $location, $flexibleSchedule, $availableDays, $availableTimes, $skills, $additionalSkills);

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