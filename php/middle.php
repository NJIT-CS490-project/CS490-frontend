<?php 
$json = json_encode(array(
  "user" => $_GET["ucid"],
  "pass" => $_GET["password"]
));

$cr = curl_init();
curl_setopt($cr, CURLOPT_URL, "http://osl84.njit.edu/~ejp9/CS490-middleend/auth.php");
curl_setopt($cr, CURLOPT_POST, true);
curl_setopt($cr, CURLOPT_POSTFIELDS, $json);
curl_setopt($cr, CURLOPT_RETURNTRANSFER, true);

$request = curl_exec($cr);

echo $request;
?>
