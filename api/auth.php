<?php
// Basit admin auth: header token ile.
// Güvenlik için bunu değiştir.
define('ADMIN_TOKEN', 'PRISMA_ADMIN_2026_SECRET');


function require_admin() {
  $hdr = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
  if ($hdr !== ADMIN_TOKEN) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["ok"=>false,"error"=>"unauthorized"]);
    exit;
  }
}
