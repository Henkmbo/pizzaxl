<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pizzaxxl');

define('APPROOT', dirname(dirname(__FILE__)));
define('ROOT', dirname(dirname(dirname(__FILE__))));


// Zet hier je virtualhostnaam. Let op dat er http:// voor staat anders werkt het niet
define('URLROOT', 'http://localhost/PizzaXXL/');

define('SITENAME', 'pizzaxxl');

date_default_timezone_set('Europe/Amsterdam');

define('TIME', date("Y-m-d H:i:s", strtotime('NOW')));

$var['timestamp'] = time();

$var['pool'] = array('_', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
$var['rand'] = $var['pool'][rand(2, 63)] . $var['pool'][rand(2, 63)] . $var['pool'][rand(2, 63)] . $var['pool'][rand(2, 63)];

$productType = [
    'pizza' => 'Pizza',
    'drinks' => 'Drinks',
    'coupons' => 'Coupons',
    'custompizza' => 'custompizza',
    'snacks' => 'Snacks'
];
$orderState = [
    'in progress' => 'in progress',
    'on the way' => 'on the way',
    'delivered' => 'delivered',
    'picked up' => 'picked up',
    'canceled' => 'canceled'
];
$orderStatus = [
    'Succes' => 'Succes',
    'Pending' => 'Pending',
    'Failed' => 'Failed'
];

$vehicleType = [
    'Car' => 'Car',
    'Bike' => 'Bike',
    'Scooter' => 'Scooter'
];