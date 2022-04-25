<?php
    include_once('src/userStorage.php');
    include_once('src/auth.php');

    session_start();
    $auth = new Auth(new UserStorage());

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
            #$contactStorage->add($data);
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

    <h1>Lépjen velünk kapcsolatba!</h1>

    <form action="" method="post" novalidate id="from">
        <div>

        </div>
        <label for="name">Név:</label>
        <input type="text" name="name" id="name" value="<?= $_POST['name'] ?? "" ?>">
        <?php if(count($_POST) > 0 && $errors['name'] !== '') : ?>
            <span class="error">
                <?= $errors['name'] ?>
            </span>
        <?php endif; ?><br>
        <label for="email">E-mail cím:</label>
        <input type="text" name="email" id="email" value="<?= $_POST['email'] ?? "" ?>">
        <?php if (isset($errors['email'])) : ?>
            <span class="error"><?= $errors['email'] ?></span>
        <?php endif; ?><br>
        
        <label for="subject">Levél téma:</label> <br>
            <input type="radio" id="complain" name="subject" value="complain" checked>
            <label for="complain">Panasz</label><br>
            <input type="radio" id="feedback" name="subject" value="feedback">
            <label for="feedback">Visszajelzés</label><br>
        <label for="text">Szöveg:</label> <br>
        <textarea name="text" id="text" cols="30" rows="10" ><?= $_POST['text'] ?? "" ?></textarea>
        <?php if (isset($errors['text'])) : ?>
            <span class="error"><?= $errors['text'] ?></span>
        <?php endif; ?><br>
        
        <button type="submit">Elküld</button>
    </form>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>    
</body>
</html>