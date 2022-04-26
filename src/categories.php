<?php
    include_once('src/userStorage.php');
    include_once('src/gameStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

    $gameStorage = new GameStorage();
    $games = $gameStorage->getAll();

    function getHighScoresInOrder($key) {
        global $games;
        usort($games[$key]["highscores"], function ($item1, $item2) {
            return $item2['score'] <=> $item1['score'];
        });
        return $games[$key]["highscores"];
    }
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Kategóriák | GC</title>
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

    <div>
        <?php foreach ($games as $key => $value) : ?>
            <p>
                <hr>
                Név: <?= $value['name'] ?><br>
                Típus: <?= $value['type'] ?><br>
                Rating: <?= $value['rating'] ?><br>
                Leírás: <?= $value['text'] ?><br>
                Legjobb eredmények:
                <ul>
                    <?php foreach (getHighScoresInOrder($key) as $id => $data) : ?>
                        <li> <?=$data["name"]?>:<?=$data["score"]?> </li>
                    <?php endforeach; ?>
                </ul>  
                <br>
            </p>
        <?php endforeach; ?>  
    </div>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>    
</body>
</html>