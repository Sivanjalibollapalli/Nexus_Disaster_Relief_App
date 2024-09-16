<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nexus_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Fetch data
$data = [];

// Requests
$sql = "SELECT * FROM request_resources ORDER BY id DESC";
$result = $conn->query($sql);
if ($result) {
    $data['requests'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    die(json_encode(["error" => "Error fetching requests data: " . $conn->error]));
}

// SOS
$sql = "SELECT * FROM sos ORDER BY id DESC";
$result = $conn->query($sql);
if ($result) {
    $data['sos'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    die(json_encode(["error" => "Error fetching SOS data: " . $conn->error]));
}

// Donations
$sql = "SELECT * FROM donations ORDER BY id DESC";
$result = $conn->query($sql);
if ($result) {
    $data['donations'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    die(json_encode(["error" => "Error fetching donations data: " . $conn->error]));
}

// Volunteers
$sql = "SELECT * FROM volunteers ORDER BY id DESC";
$result = $conn->query($sql);
if ($result) {
    $data['volunteers'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    die(json_encode(["error" => "Error fetching volunteers data: " . $conn->error]));
}

// Resources
$sql = "SELECT * FROM resources ORDER BY id DESC";
$result = $conn->query($sql);
if ($result) {
    $data['resources'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    die(json_encode(["error" => "Error fetching resources data: " . $conn->error]));
}

$data = [
    'requests' => $requestsData,
    'sos' => $sosData,
    'donations' => $donationsData,
    'volunteers' => $volunteersData,
    'resources' => $resourcesData,
    'counts' => [
        'requests' => count($requestsData),
        'sos' => count($sosData),
        'donations' => count($donationsData),
        'volunteers' => count($volunteersData),
        'resources' => count($resourcesData),
    ]
];


echo json_encode($data);

$conn->close();
?>