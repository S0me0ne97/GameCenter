<?php
include_once('src/userStorage.php');
include_once('src/gamesavesstorage.php');
include_once('src/gameStorage.php');
include_once('src/auth.php');

session_start();
$auth = new Auth(new UserStorage());

$gameStorage = new GameStorage();
$games = $gameStorage->getAll();
$highscores = $games[3]["highscores"];
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
    <title>Köss Össze Hármat | GC</title>
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
        <p>Válassz pályaméretet és utána már kezdheted is.</p>
        <input type="radio" id="easy" name="difficulty" value="easy" checked>
        <label for="easy">5x5</label>
        <input type="radio" id="medium" name="difficulty" value="medium">
        <label for="medium">6x6</label>
        <input type="radio" id="hard" name="difficulty" value="hard">
        <label for="hard">7x7</label>
        <button id="startbtn">Start</button>
        |
        <button id="pause">Szünet</button>
        <button id="save" hidden>Mentés</button>
        <button id="load" hidden>Betöltés</button>
        <button id="description">Játékleírás</button>
    </div>
    <div id="descriptionDiv" hidden>
        <h3>Leírás</h3>
        <p>
            A játék célja, hogy egy sorban vagy oszlopban 3, 4 vagy 5 kör kerüljön egymás mellé.
        </p>
        <p>
            A játékot az egérrel lehet irányítani. Kattints valamelyik mezőre, utána egy vele szomszédos mezőre, aminél úgy gondolod, hogy ha felcserélődnek, akkor lesz egy érvényes lépésed.
            Ha nem látsz ilyen mozgatást, akkor 100 pont levonásáért újratöltheted a pályát.
            50 pontot kapsz minden találat után. 
        </p>
        <p>
            A játéknak akkor van vége, ha lejár az idő.
        </p>
    </div>
    <br>
    <div id="game" hidden>
        <label id="minutes">00</label>:<label id="seconds">00</label>
        <label id="points">pontok: 0</label>
        <button id="refresh">Újratöltés</button>
        <table id="gametable"></table>
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
    <div id="userid" hidden><?php if ($auth->is_authenticated()) {echo $auth->get_user();} else {echo 0;} ?></div>
    
    <div id="passdata" hidden><?= $savesJSON ?></div>
    <script src="js/connect3.js" type="module"></script>
</body>
</html>