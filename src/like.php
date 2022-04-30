<?php

include_once('userStorage.php');
include_once('auth.php');

session_start();
$users = new UserStorage();
$auth = new Auth($users);

if (isset($_GET['liked'])) {
    global $users;
    $game = $_GET['liked'];
    $user = $auth->authenticated_user();
    if (!in_array($game, $user["liked"])) {
        array_push($user["liked"], $game);
        $users->update($user["id"], $user);
    }
    else
    {
        $user["liked"] = array_filter($user["liked"], static function($elem) {
            global $game;
            return $elem !== $game;
        });
        $users->update($user["id"], $user);
    }
}
header("Location: categories.php");

?>