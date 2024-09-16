<?php
include 'db_connect.php';
header('Content-Type: application/json');

$sql = "SELECT resource_name, quantity FROM resources";
$result = $conn->query($sql);

$resources = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $resources[] = $row;
    }
}

echo json_encode($resources);

$conn->close();
?>