<?php
include_once('src/userStorage.php');
include_once('src/gamesavesstorage.php');
include_once('src/gameStorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$gameStorage = new GameStorage();
$games = $gameStorage->getAll();
$highscores = $games[4]["highscores"];
$finalHighscores = [];
$i = 1;
foreach ($highscores as $id => $highscore) {
    $finalHighscores[$i] = json_encode($highscore["$i"]);
    $i = $i + 1;
}
function getHighScoresInOrder() {
    global $finalHighscores;
    usort($finalHighscores, function ($item1, $item2) {
        $a = json_decode($item2, true);
        $b = json_decode($item1, true);
        return intval($a["point"]) <=> intval($b["point"]);
    });
    return array_slice($finalHighscores, 0, 5);
}

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
    <title>Kártyás memóriajáték | GC</title>
    <link rel="icon" href="../media/logo_mini.png">
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><img src="../media/logo_mini.png" alt="Logo"></li>
            <li><a href="../index.php">Kezdőlap</a></li>
            <li><a href="categories.php">Játékok</a></li>
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
        <a href="categories.php" class="button">Vissza</a></button><br>
        <p>Válassz nehézségi szintet és utána már kezdheted is.</p>
        <input type="radio" id="easy" name="difficulty" value="easy" checked>
        <label for="easy">Könnyű</label>
        <input type="radio" id="medium" name="difficulty" value="medium">
        <label for="medium">Közepes</label>
        <input type="radio" id="hard" name="difficulty" value="hard">
        <label for="hard">Nehéz</label>
        <button id="startbtn">Start</button>
        |
        <button id="pause">Szünet</button>
        <button id="save">Mentés</button>
        <button id="load">Betöltés</button>
        <button id="description">Játékleírás</button>
    </div>
    <br>
    <div id="game" hidden>
        <label id="minutes">00</label>:<label id="seconds">00</label>
        <label id="points">pontok: 0</label>
        <table id="gametable" class="memorygame"></table>
    </div>
    <div id="descriptionDiv" hidden>
        <h3>Leírás</h3>
        <p>
            A játék célja, hogy megtaláld a táblán az összes párt.
        </p>
        <p>
            A játékot az egér segítségével tudod játszani. Kattints egy lefordított mezőre, majd egy másik lefordított mezőre.
            Ha egyeznek a mezők, akkor felfordítva maradnak, ha nem akkor mind a kettő visszafordul.
            50 pontot kapsz minden sikeresen megtalált párért. A játék végén a hátramaradt idő után minden másodpercért kapsz egy extra pontot.
        </p>
        <p>
            A játéknak akkor van vége, ha lejár az idő, vagy ha megtaláltad az összes párt.
        </p>
    </div>
    
    <div>
        <h3>Ranglista</h3>
        <ul>
            <?php foreach (getHighScoresInOrder() as $data) : ?>
                <li> <?=json_decode($data, true)["name"]?> - <?=json_decode($data, true)["point"]?> </li>
            <?php endforeach; ?>
        </ul>
    </div>
    
    <div id="savesdiv" hidden></div>
    <div id="userid" hidden><?php if ($auth->is_authenticated()) {echo $auth->get_user();} else {echo 0;} ?> </div>
    
    <div id="passdata" hidden><?= $savesJSON ?></div>
    <script src="js/memorycardgame.js" type="module"></script>
</body>
</html>