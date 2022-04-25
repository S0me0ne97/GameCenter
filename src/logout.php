<?php

include('userStorage.php');
include('auth.php');

session_start();

$auth = new Auth(new UserStorage());
$auth->logout();
header("Location: ../index.php");

?>