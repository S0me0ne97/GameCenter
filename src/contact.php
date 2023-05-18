<?php
    include_once('src/userStorage.php');
    include_once('src/contactStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

    $contactStorage = new ContactStorage();
    $contacts = $contactStorage->getAll();

    $data = [];
    $errors = [];

    
    if (count($_POST) > 0) {
        $errors['name'] = '';
        $errors['email'] = '';
        $errors['text'] = '';
        $errors['subject'] = '';
        if (validate($_POST, $errors)) {
            $authenticated_user = $auth->authenticated_user();
            $data['name'] = $_POST['name'];
            $data['email'] = $_POST['email'];
            $data['text'] = $_POST['text'];
            $data['subject'] = $_POST['subject'];
            $data['date'] = date("Y-m-d");
            $contactStorage->add($data);
            $_POST['name'] = '';
            $_POST['email'] = '';
            $_POST['text'] = '';
            header("Refresh:0");
        }
    }
    
    function validate($post, &$errors) {
        $emptyerror = "Nem lehet üresen hagyni!";
        if (!isset($post['name']) || $post['name'] === '') {
            $errors['name'] = $emptyerror;
        }
        if (!isset($post['email']) || $post['email'] === '') {
            $errors['email'] = $emptyerror;
        }
        if (!isset($post['text']) || $post['text'] === '') {
            $errors['text'] = $emptyerror;
        }
        return $errors['name'] === '' && $errors['email'] === '' && $errors['text'] === '';
      }
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Kapcsolat | GC</title>
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><img src="media/logo.png" alt="Logo"></li>
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
        <h1>Lépjen velünk kapcsolatba!</h1>

        <form action="" method="post" novalidate id="from">
            <div>

            </div>
            <label for="name" id="left">Név:</label>
            <input type="text" name="name" id="name" value="<?= $_POST['name'] ?? "Gipsz Jakab" ?>">
            <?php if(count($_POST) > 0 && $errors['name'] !== '') : ?>
                <span class="error">
                    <?= $errors['name'] ?>
                </span>
            <?php endif; ?>
            <br><br>

            <label for="email" id="left">E-mail cím:</label>
            <input type="text" name="email" id="email" value="<?= $_POST['email'] ?? "gipsz.jakab@pelda.hu" ?>">
            <?php if (isset($errors['email'])) : ?>
                <span class="error"><?= $errors['email'] ?></span>
            <?php endif; ?>
            <br><br>
            
            <label for="subject" id="left">Levél téma:</label> <br>
            
            <input type="radio" id="complain" name="subject" value="complain" checked>
            <label for="complain" id="complain">Panasz</label><br>

            <input type="radio" id="feedback" name="subject" value="feedback">
            <label for="feedback">Visszajelzés</label>
            
            <br><br>
            <label for="text" id="left">Szöveg:</label><br>
            <textarea name="text" id="text" cols="30" rows="10" ><?= $_POST['text'] ?? "Ide irja a szoveget..." ?></textarea>
            <?php if (isset($errors['text'])) : ?>
                <span class="error"><?= $errors['text'] ?></span>
            <?php endif; ?>
            <br><br>
            <button type="submit">Elküld</button>
            <br>
            <p></p>
        </form>

        <?php if($auth->authorize(["admin"])) : ?>
            <div>
                <?php foreach ($contacts as $key => $value) : ?>
                    <p>
                        <hr>
                        Név: <?= $value['name'] ?><br>
                        Email: <?= $value['email'] ?><br>
                        Tárgy: <?= $value['subject'] ?><br>
                        Üzenet: <?= $value['text'] ?><br>
                        <a href="delete.php?contact=<?= $key ?>">Törlés</a>
                    </p>
                <?php endforeach; ?>  
            </div>
        <?php endif; ?>     
    </div>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>    
</body>
</html>