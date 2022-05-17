<?php
include_once('src/userStorage.php');
include_once('src/gameStorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$gameStorage = new GameStorage();
$games = $gameStorage->getAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Space Shooter | GC</title>
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
        <label for="easy">Könnyű</label>
        <input type="radio" id="medium" name="difficulty" value="medium">
        <label for="medium">Közepes</label>
        <input type="radio" id="hard" name="difficulty" value="hard">
        <label for="hard">Nehéz</label>
        <button id="startbtn">Start</button>
        |
        <button id="pause">Pause</button>
        <button id="save">Mentés</button>
        <button id="load">Betöltés</button><br>
    </div>
    <br>
    <div id="game" hidden>
        <canvas id="canvas" width="500" height="700"></canvas>
    </div>

    <script src="js/space_shooter.js" type="module"></script>
</body>
</html>