<?php
    include_once('src/userStorage.php');
    include_once('src/gameStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

    $gameStorage = new GameStorage();
    $games = $gameStorage->getAll();
    sortByRating(false);
    $category = "";

    function chooseCateg() {
        global $games;
        $games = array_filter($games, function($value){
            global $category;
            return $value["type"] == $category;
        });
    }

    function onlyLiked(){
        global $auth;
        $auth = new Auth(new UserStorage());
        global $games;
        $games = array_filter($games, function($value) {
            global $auth;
            return in_array($value["id"], $auth->authenticated_user()["liked"]);
        });
    }

    function sortByRating($reversed) {
        global $games;
        usort($games, function ($item1, $item2) {
            return $item2['rating'] <=> $item1['rating'];
        });
        if ($reversed) {
            $games = array_reverse($games);
        }
    }

    function getHighScoresInOrder($key) {
        global $games;
        usort($games[$key]["highscores"], function ($item1, $item2) {
            return $item2['score'] <=> $item1['score'];
        });
        return $games[$key]["highscores"];
    }

    if(array_key_exists('rating', $_POST)) {
        sortByRating(false);
    }
    if(array_key_exists('revrating', $_POST)) {
        sortByRating(true);
    }
    if(array_key_exists('action', $_POST)) {
        global $category;
        $category = "action";
        chooseCateg();
    }
    if(array_key_exists('logic', $_POST)) {
        global $category;
        $category = "logic";
        chooseCateg();
    }
    if(array_key_exists('shooter', $_POST)) {
        global $category;
        $category = "shooter";
        chooseCateg();
    }
    if(array_key_exists('liked', $_POST)) {
        onlyLiked();
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
    <form action="" method="post">
        <input type="submit" name="rating"
                class="button" value="Értékelés alapján" />
        <input type="submit" name="revrating"
                class="button" value="Értékelés alapján fordítva" />
        <?php if($auth->is_authenticated()) : ?>
            <input type="submit" name="liked"
                    class="button" value="Kedvelt" />
        <?php endif ?>
        <input type="submit" name="action"
                class="button" value="Akció" />
        <input type="submit" name="shooter"
                class="button" value="Lövödözős" />
        <input type="submit" name="logic"
                class="button" value="Logikai" />
    </form>
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
                <?php if($auth->is_authenticated()) : ?>
                    <a href="like.php?liked=<?= $value["id"] ?>">Kedvel</a>
                <?php endif ?>
                <a href="<?= $value['page'] ?>">Játék</a>
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