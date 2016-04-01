<?php

function remove_param($url, $key) {
  $url = preg_replace('/(.*)(?|&)' . $key . '=[^&]+?(&)(.*)/i', '$1$2$4', $url . '&');
  $url = substr($url, 0, -1);
  return $url;
}


$middle = 'http://osl84.njit.edu/~ejp9/CS490-middleend/';
$request = $_SERVER['REQUEST_URI'];
$endpoint = $_GET['endpoint'];
$url = remove_param($middle . $endpoint . $request, 'endpoint');
$ch = curl_init();
$headers = getallheaders();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $request = file_get_contents("php://input");
  curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
}

if (isset($headers['Cookie'])) {
  curl_setopt($ch, CURLOPT_COOKIE, $headers['Cookie']);
}

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, TRUE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

$response = curl_exec($ch);


$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$headerArray = explode(PHP_EOL, $headers);

foreach($headerArray as $header) {
  $colonPos = strpos($header, ':');

  if ($colonPos !== FALSE) {
    $headerName = substr($header, 0, $colonPos);
    if (trim($headerName) == 'Content-Encoding') continue;
    if (trim($headerName) == 'Content-Length') continue;
    if (trim($headerName) == 'Transfer-Encoding') continue;
  }

  header($header, FALSE);
}

echo $body;

curl_close($ch);
