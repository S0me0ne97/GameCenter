<?php
    include_once('src/userStorage.php');
    include_once('src/gameStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());
    $gameStorage = new GameStorage();
    $games = $gameStorage->getAll();

    function getGame($gameid)
    {
        global $auth;
        global $games;
        $username = $auth->get_username();
        $ret = [];
        $ret["name"] = $games[$gameid]["name"];
        $maxscore = 0;
        $i = 1;
        foreach ($games[$gameid]["highscores"] as $id => $highscore) {
            if ($highscore["$i"]["name"] === $username) {
                if ($highscore["$i"]["point"] > $maxscore) {
                    $maxscore = $highscore["$i"]["point"];
                }
            }
            $i = $i + 1;
        }
        $ret["maxscore"] = $maxscore;
        $ret["pic"] = $games[$gameid]["pic"];
        $ret["page"] = $games[$gameid]["page"];
        return $ret;
    }
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Profil | GC</title>
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
    <h1>Profil</h1>
    <p>Név: <?= $auth->authenticated_user()['username']?></p>
    <p>E-mail: <?= $auth->authenticated_user()['email']?></p>
    <p>Játékok: </p>
    <?php for ($i=1; $i < 5; $i++) : ?>
        <p>
            <a href="<?= getGame($i)["page"] ?>"><?= getGame($i)["name"] ?></a> <br>
            <a href="<?= getGame($i)["page"] ?>">
                <img src="<?= getGame($i)["pic"] ?>" alt="<?= getGame($i)["name"] ?> kép" srcset="">
            </a> <br>
            Max pont: <?= getGame($i)["maxscore"] ?>
        </p>
    <?php endfor; ?>
    <footer>
        <p>
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>
</body>
</html>