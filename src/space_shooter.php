<?php
include_once('src/userStorage.php');
include_once('src/gamesavesstorage.php');
include_once('src/gameStorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$gameStorage = new GameStorage();
$games = $gameStorage->getAll();
$highscores = $games[1]["highscores"];
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
    <title>Space Shooter | GC</title>
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
    <div id="descriptionDiv" hidden>
        <h3>Leírás</h3>
        <p>
            A játék célja, hogy minél tovább életben maradj és közben a lehető legtöbb ellenséges hajót pusztítsd el.
        </p>
        <p>
            Az űrhajódat a balra és jobbra nyilakkal tudod mozgatni. Az x gomb lenyomásával tudsz lőni.
            Ha eltalálsz egy ellenséges űrhajót, akkor az elpusztul, te pedig kapsz 10 pontot érte. Az ellenséges űrhajók is tudnak lőni, ha eltalálnak akkor elvesztesz egy életet.
            Ha elpusztítasz egy ellenséges űrhajót, akkor lehet, hogy megjelenik a pályán egy kék zöld vagy piros erősítés.
            Vedd fel az erősítést, és az alapján, hogy milyen színe van kapsz valami jutalmat érte.
            A piros erősítés extra életet ad. A kék erősítés extra mozgási sebességet biztosít 20 másodpercig. A zöld erősítés pedig halhatatlanná tesz 20 másodpercig.
            Vigyázz nehogy összeütközz egy ellenséges űrhajóval, mert akkor elveszted az összes életed.
        </p>
        <p>
            A játéknak akkor van vége, ha elfogy az összes életed.
        </p>
    </div>
    <br>
    <div id="game" hidden>
        <canvas id="canvas" width="500" height="700"></canvas>
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
    <script src="js/space_shooter.js" type="module"></script>
</body>
</html>