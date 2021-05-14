<?php
//config
set_time_limit(0);
ini_set('max_execution_time', 0);

const TOKEN = '5bed5805eee506590a0d889451647c8b';
$regNum = $_POST['regNum'];
$ctcNum = $_POST['ctcNum'];


$curl_solo = curl_init();
curl_setopt_array($curl_solo, array(
  CURLOPT_URL => "https://api-cloud.ru/api/gibdd.php?regNumber=".$regNum."&type=fines&stsNumber=".$ctcNum."&token=".TOKEN,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
));
$response = curl_exec($curl_solo);

echo json_encode($response);
