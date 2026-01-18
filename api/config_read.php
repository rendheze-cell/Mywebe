<?php
header('Content-Type: application/json; charset=utf-8');

$path = __DIR__ . '/../assets/data/config.json';
if (!file_exists($path)) {
  http_response_code(404);
  echo json_encode(["ok"=>false,"error"=>"config_not_found"]);
  exit;
}

echo file_get_contents($path);
