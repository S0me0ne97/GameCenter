<?php

include_once('auth.php');
include_once('userStorage.php');

session_start();

$user_storage = new UserStorage();
$auth = new Auth($user_storage);

$data = [];
$errors = [];

if ($_POST) {
    if (validate($_POST, $data, $errors)) {
        $auth_user = $auth->authenticate($data['username'], $data['password']);
        if (!$auth_user) {
          $errors['global'] = "Helytelen felhasználónév vagy jelszó!";
        } else {
          $auth->login($auth_user);
          header("Location: ../index.php");
        }
    }
}

function validate($post, &$data, &$errors) {
    if ($post['username'] === '') {
        $errors['username'] = "Meg kell adni a felhasználónevet!";
    }
    if ($post['password'] === '') {
      $errors['password'] = "Meg kell adni a jelszót!";
    }
    $data = $post;
    return count($errors) === 0;
  }

?>

<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Bejelentkezés | GC</title>
    <link rel="icon" href="../media/logo_mini.png">
</head>

<body>
    <h1>Bejelentkezés</h1>
    <br>
    <?php if (isset($errors['global'])) : ?>
    <p><span class="error"><?= $errors['global'] ?></span></p>
    <?php endif; ?>
    <form action="" method="post" novalidate>
        <div>
            <label for="username">Felhasználónév: </label><br><br>
            <input type="text" name="username" id="username" value="<?= $_POST['username'] ?? "" ?>">
            <?php if (isset($errors['username'])) : ?>
            <span class="error"><?= $errors['username'] ?></span>
            <?php endif; ?>
        </div>
        <br>
        <div>
            <label for="password">Jelszó: </label><br><br>
            <input type="password" name="password" id="password">
            <?php if (isset($errors['password'])) : ?>
            <span class="error"><?= $errors['password'] ?></span>
            <?php endif; ?>
        </div>
        <br>
        <div>
            <button type="submit">Bejelentkezés</button>
        </div>
    </form>
    <br>
    <a href="../index.php">Vissza a főoldalra</a> <a href="registration.php">Regisztráció</a>

</body>

</html>