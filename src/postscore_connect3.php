<?php

include_once('userStorage.php');
include_once('auth.php');
include_once('gameStorage.php');

session_start();
$users = new UserStorage();
$auth = new Auth($users);
$gameStorage = new GameStorage();

if (isset($_GET['data'])) {
    global $users;
    global $saves;

    $decoded = json_decode($_GET['data']);
    $username = $auth->get_username();
    $game = $gameStorage->getAll()['3'];
    $newid = count($game['highscores']) + 1;

    $newHighScore['name'] = $username;
    $newHighScore['point'] = $_GET['data'];

    $finaladdition[$newid] = $newHighScore;

    array_push($game['highscores'], $finaladdition);
    $gameStorage->update('3', $game);

    header("Location: connect3.php");
}

?>