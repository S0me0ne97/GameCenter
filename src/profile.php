<?php
    include_once('src/userStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

    $name = "6266c0b6b6688";
    $time = "12:34:56";
    $games[] = "";

    function getUser($authorId)
    {
        $userStorage = new UserStorage();
        return $userStorage->findById($authorId)['username'];
    }
    function getEmail($authorId)
    {
        $userStorage = new UserStorage();
        return $userStorage->findById($authorId)['email'];
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
    <h1>Profil</h1>
    <p>Név: <?= $auth->authenticated_user()['username']?></p>
    <p>E-mail: <?= $auth->authenticated_user()['email']?></p>
    <p>Összes lejátszott idő: <?= $auth->authenticated_user()['playedtime'] ?></p>
    <p>Játékok: </p>
    
    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>
</body>
</html>