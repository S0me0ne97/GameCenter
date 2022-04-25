<?php

include('auth.php');
include('userStorage.php');

$userStorage = new UserStorage();
$auth = new Auth($userStorage);
$errors = [];
$data = [];

if (count($_POST) > 0) {
    if (validate($_POST, $data, $errors)) {
      if ($auth->user_exists($data['username'])) {
        $errors['username'] = "Ez a felhasználónév foglalt!";
      }
      else if ($auth->user_exists($data['email'])) {
        $errors['email'] = "Ehhez az e-mail címház már tartozik felhasználó!";
      } else {
        $auth->register($data);
        header("Location: login.php");
      } 
    }
}

function validate($post, &$data, &$errors) {
    if($post['username'] === '') {
        $errors['username'] = "Meg kell adni a felhasználónevet!";
    }
    if($post['email'] === '') {
        $errors['email'] = "Meg kell adni az e-mailt!";
    }
    else if(filter_var($post['email'], FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = "Az e-mail formátuma nem megfelelő!";
    }
    if($post['password'] === '') {
        $errors['password'] = "Meg kell adni a jelszót!";
    }
    else if($post['password'] !== $post['password2']) {
        $errors['password2'] = "A két jelszó nem egyezik!";
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
    <link rel="stylesheet" href="index.css">
    <title>ETS | Regisztráció</title>
</head>

<body>
    <h1>Regisztráció</h1>

    <form action="" method="post" novalidate>
        <div>
            <label for="username">Felhasználónév: </label><br>
            <input type="text" name="username" id="username" value="<?= $_POST['username'] ?? "" ?>" required>
            <?php if (isset($errors['username'])) : ?>
            <span class="error"><?= $errors['username'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <label for="email">E-mail: </label><br>
            <input type="email" name="email" value="<?= $_POST['email'] ?? "" ?>" required>
            <?php if (isset($errors['email'])) : ?>
            <span class="error"><?= $errors['email'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <label for="password">Jelszó: </label><br>
            <input type="password" name="password" id="password" required>
            <?php if (isset($errors['password'])) : ?>
            <span class="error"><?= $errors['password'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <label for="password2">Jelszó ismét: </label><br>
            <input type="password" name="password2" id="password2" required>
            <?php if (isset($errors['password2'])) : ?>
            <span class="error"><?= $errors['password2'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <button type="submit">Regisztráció</button>
        </div>
    </form>

</body>

</html>