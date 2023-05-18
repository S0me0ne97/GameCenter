<?php
include_once('src/userStorage.php');
include_once('src/gamesavesstorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$savesStorage = new GameSavesStorage();
$saves = $savesStorage->getAll();

$savesJSON = json_encode($saves);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Candy Crush | GC</title>
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><img src="media/logo.png" alt="Logo"></li>
            <li><a href="../index.php">Kezdőlap</a></li>
            <li><a href="categories.php">Kategóriák</a></li>
            <li><a href="contact.php">Kapcsolat</a></li>
            <?php if(!$auth->is_authenticated()) : ?>
                <li><a id="right" href="login.php">Bejelentkezés</a></li>
            <?php else : ?>
                <li><a href="profile.php">Profil</a></li>
                <li><a id="right" href="logout.php">Kijelentkezés</a></li>
            <?php endif ?>
        </ul> 
    </nav>
    <div id="menu">
        <input type="radio" id="easy" name="difficulty" value="easy" checked>
        <label for="easy">5x5</label>
        <input type="radio" id="medium" name="difficulty" value="medium">
        <label for="medium">6x6</label>
        <input type="radio" id="hard" name="difficulty" value="hard">
        <label for="hard">7x7</label>
        <button id="startbtn">Start</button>
        |
        <button id="pause">Szünet</button>
        <?php if($auth->is_authenticated()) : ?>
            <button id="save">Mentés</button>
            <button id="load">Betöltés</button><br>
        <?php endif; ?>
    </div>
    <br>
    <div id="game" hidden>
        <label id="minutes">00</label>:<label id="seconds">00</label>
        <label id="points">pontok: 0</label>
        <table id="gametable"></table>
    </div>

    
    <div id="savesdiv" hidden></div>
    
    <div id="passdata" hidden><?= $savesJSON ?></div>
    <script src="js/candycrush.js" type="module"></script>
</body>
</html>