<?php
    include_once('src/userStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title>Gaming Center</title>
    <link rel="icon" href="media/logo_mini.png">
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><img src="media/logo_mini.png" alt="Logo"></li>
            <li><a href="index.php">Kezdőlap</a></li>
            <li><a href="src/categories.php">Játékok</a></li>
            <li><a href="src/contact.php">Kapcsolat</a></li>
            <?php if(!$auth->is_authenticated()) : ?>
                <li><a id="right" href="src/login.php">Bejelentkezés</a></li>
            <?php else : ?>
                <li><a href="src/profile.php">Profil</a></li>
                <li><a id="right" href="src/logout.php">Kijelentkezés</a></li>
            <?php endif ?>
        </ul> 
    </nav>
    
    <div id="diszes_div">
        <img src="media/logo_medium.png" alt="Gaming Center logo">
        <h1 id="title">Gaming Center</h1>

        <div class="body">
            <h1>Üdvözlünk a Game Center játékoldalunkon!</h1>
            <p>Próbálj ki minél több játékot és regisztrálj, ha megtetszik az oldalunk.</p>
            <table>
                <tr>
                    <th>
                        <img src="/media/spaceshooter.png" alt="Space Shooter játék">
                    </th>
                    <th>
                        <img src="/media/connect3.png" alt="Köss Össze Hármat játék">
                    </th>
                </tr>
                <tr>
                    <th>
                        <img src="/media/memorygame.png" alt="Kártyás memória játék">
                    </th>
                    <th>
                        <img src="/media/miniwars.png" alt="Mini wars    játék">
                    </th>
                    </th>
                </tr>
            </table>
            <p>Lépj velünk kapcsolatba, ha szeretnél javaslatot vagy panaszt tenni az oldallal kapcsolatban.</p>
        </div>

    </div>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>
</body>
</html>