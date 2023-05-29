<?php

include_once('userStorage.php');
include_once('auth.php');
include_once('gamesavesstorage.php');

session_start();
$users = new UserStorage();
$auth = new Auth($users);
$saves = new GameSavesStorage();

if (isset($_GET['data'])) {
    global $users;
    global $saves;
    $decoded = json_decode($_GET['data']);
    $user = $auth->authenticated_user();
    $savedgame['userid'] = $user["id"];
    $savedgame['game'] = "miniwars";
    $savedgame['gamedata'] = $_GET['data'];
    $saves->add($savedgame);
    
    header("Location: miniwars.php");
}

?>