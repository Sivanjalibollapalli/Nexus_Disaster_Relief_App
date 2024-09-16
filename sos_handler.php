<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nexus_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Invalid request method");
    }

    if (!isset($_POST['location']) || empty($_POST['location'])) {
        throw new Exception("Location is required");
    }

    $location = $conn->real_escape_string($_POST['location']);
    
    // Handle file upload
    if (!isset($_FILES['video']) || $_FILES['video']['error'] != UPLOAD_ERR_OK) {
        throw new Exception("Video file is required");
    }

    $upload_dir = 'uploads/';  
    $video_name = uniqid() . '_' . basename($_FILES['video']['name']);
    $video_path = $upload_dir . $video_name;

    if (!move_uploaded_file($_FILES['video']['tmp_name'], $video_path)) {
        throw new Exception("Failed to upload video");
    }

    $sql = "INSERT INTO sos (location, video_path) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $location, $video_path);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    echo json_encode(['status' => 'success', 'message' => 'SOS record created successfully']);

} catch (Exception $e) {
    error_log("SOS Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>