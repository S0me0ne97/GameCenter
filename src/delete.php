<?php

include_once('userStorage.php');
include_once('contactStorage.php');
include_once('auth.php');

session_start();
$auth = new Auth(new UserStorage());

if($auth->authorize(["admin"])) {
    if (isset($_GET['contact'])) {
        $contact = $_GET['contact'];
        $contactStorage = new ContactStorage();
        $contactStorage->delete($contact);
    }
    header("Location: contact.php");
}

?>