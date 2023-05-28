<?php
include_once('src/userStorage.php');
include_once('src/gamesavesstorage.php');
include_once('src/gameStorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$gameStorage = new GameStorage();
$games = $gameStorage->getAll();
$highscores = $games[2]["highscores"];
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
    <title>Mini Wars | GC</title>
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
        <button id="stageselect">Pályaválasztás</button>
        <button id="startbtn">Újrakezdés</button>
        |
        <button id="pause">Szünet</button>
        <button id="save">Mentés</button>
        <button id="load">Betöltés</button>
        <button id="description">Játékleírás</button>
    </div>
    <br>
    <div id="descriptionDiv" hidden>
        <h3>Leírás</h3>
    </div>
    <br>
    <div id="gameDiv" hidden>
        <label id="minutes">00</label>:<label id="seconds">00</label>
        <label id="points">pontok: 0</label><br>
        <canvas id="canvas" width="700" height="500"></canvas>
    </div>
    <div id="chooseGameDiv"></div>
    
    <div id="savesdiv" hidden></div>
    <div id="userid" hidden><?php if ($auth->is_authenticated()) {echo $auth->get_user();} else {echo 0;} ?></div>

    <div>
        <h3>Ranglista</h3>
        <ul>
            <?php foreach (getHighScoresInOrder() as $data) : ?>
                <li> <?=json_decode($data, true)["name"]?> - <?=json_decode($data, true)["point"]?> </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <div id="passdata" hidden><?= $savesJSON ?></div>
    <script src="js/miniwars.js" type="module"></script>
</body>
</html>