<?php
    include_once('src/userStorage.php');
    include_once('src/gameStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

    $gameStorage = new GameStorage();
    $games = $gameStorage->getAll();
    $category = "";

    function chooseCateg() {
        global $games;
        $games = array_filter($games, function($value){
            global $category;
            return $value["type"] == $category;
        });
    }
    if(array_key_exists('akció', $_POST)) {
        global $category;
        $category = "akció";
        chooseCateg();
    }
    if(array_key_exists('logikai', $_POST)) {
        global $category;
        $category = "logikai";
        chooseCateg();
    }
    if(array_key_exists('lövöldözős', $_POST)) {
        global $category;
        $category = "lövöldözős";
        chooseCateg();
    }
    if(array_key_exists('all', $_POST)) {
        $games = $gameStorage->getAll();
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
    <div id="diszes_div">
        <form action="" method="post">
            <br>
            <input type="submit" name="all"
                    class="button" value="Összes" />
            <input type="submit" name="akció"
                    class="button" value="Akció" />
            <input type="submit" name="lövöldözős"
                    class="button" value="Lövödözős" />
            <input type="submit" name="logikai"
                    class="button" value="Logikai" />
        </form>
        <div>
            <?php foreach ($games as $key => $value) : ?>
                <p>
                    <?= $value['name'] ?><br>
                    Típus: <?= $value['type'] ?><br>
                    <a href="<?= $value['page'] ?>">
                        <img src="<?= $value['pic'] ?>" alt="<?= $value['pic'] ?>"><br>
                    </a>
                    <br>
                </p>
            <?php endforeach; ?>  
        </div>
    </div>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>
</body>
</html>