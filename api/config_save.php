<?php
require_once __DIR__ . '/auth.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');

$path = __DIR__ . '/../assets/data/config.json';
$raw = file_get_contents('php://input');

if (!$raw) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"empty_body"]);
  exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"invalid_json"]);
  exit;
}

// Basit doğrulama
if (!isset($data["gifts"]) || !isset($data["wheel"]) || !isset($data["lang"]) || !isset($data["general"])) {
  http_response_code(400);
  echo json_encode(["ok"=>false,"error"=>"missing_keys"]);
  exit;
}

// Dosyaya güvenli yaz
$tmp = $path . '.tmp';
if (file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)) === false) {
  http_response_code(500);
  echo json_encode(["ok"=>false,"error"=>"write_failed_tmp"]);
  exit;
}
if (!rename($tmp, $path)) {
  http_response_code(500);
  echo json_encode(["ok"=>false,"error"=>"rename_failed"]);
  exit;
}

echo json_encode(["ok"=>true]);
