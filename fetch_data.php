
<?php
// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Set headers
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nexus_db";


$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Initialize data array
$data = [];

// Function to fetch data safely
function fetchData($conn, $table, $columns = '*') {
    $sql = "SELECT $columns FROM $table";
    $result = $conn->query($sql);
    if ($result) {
        return $result->fetch_all(MYSQLI_ASSOC);
    } else {
        die(json_encode(["error" => "Error fetching $table data: " . $conn->error]));
    }
}

// Fetch data for each table
$data['requests'] = fetchData($conn, 'request_resources');
$data['sos'] = fetchData($conn, 'sos');
$data['donations'] = fetchData($conn, 'donations', 'id,name,contact,email,amount,donation_designation,donation_frequency');
$data['volunteers'] = fetchData($conn, 'volunteers');
$data['resources'] = fetchData($conn, 'resources');

// Add counts to the data
$data['counts'] = [
    'requests' => count($data['requests']),
    'sos' => count($data['sos']),
    'donations' => count($data['donations']),
    'volunteers' => count($data['volunteers']),
    'resources' => count($data['resources'])
];

// Output JSON
echo json_encode($data);

// Close connection
$conn->close();