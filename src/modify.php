<?php

include_once('teamStorage.php');
include_once('matchStorage.php');
include_once('userStorage.php');
include_once('commentStorage.php');
include_once('auth.php');

$id = $_GET['match'];

$matchStorage = new MatchStorage();
$match = $matchStorage->findById($id);

$errors = [];

session_start();
$auth = new Auth(new UserStorage());

if(count($_POST) > 0) {
  if ($auth->authorize(["admin"])) {
    if (validate($_POST, $match, $errors)) {
      $matchStorage->update($id, $match);
      
      header("Location: index.php");
    }
  }
  else {
    echo "Nem jogosult módosítani!";
  }
}

function validate($post, &$data, &$errors) {
    $errors['date'] = '';
    $errors['team1'] = '';
    $errors['team2'] = '';
    $filter_options = array( 
        'options' => array( 'min_range' => 0) 
    );

    if ($post['date'] === '') {
      $errors['date'] = 'Adja meg a dátumot!';
    }
    else if (!filter_var($post['date'], FILTER_VALIDATE_REGEXP,
        ['options' => ['regexp' => '/\\d\\d\\d\\d-\\d\\d-\\d\\d/i']])) {
            $errors['date'] = 'Nem megfelelő formátum!';
        }
    $data['date'] = $post['date'];

    if ($post['team1'] === '') {
      $errors['team1'] = 'Az eredmény kitöltése kötelező!';
    }
    else if( filter_var( $post['team1'], FILTER_VALIDATE_INT, $filter_options ) === FALSE) {
        $errors['team1'] = 'Az eredménynek pozitív vagy nulla számnak kell lennie!';
    }
    else {
        $data['home']['score'] = $post['team1'];
    }

    if ($post['team2'] === '') {
        $errors['team2'] = 'Az eredmény kitöltése kötelező!';
    }
    else if( filter_var( $post['team2'], FILTER_VALIDATE_INT, $filter_options ) === FALSE) {
        $errors['team2'] = 'Az eredménynek pozitív vagy nulla számnak kell lennie!';
    }
    else {
        $data['away']['score'] = $post['team2'];
    }
    return $errors['date'] === '' && $errors['team1'] === '' && $errors['team2'] === '';
}

function getTeam($teamId)
{
    $teamStorage = new TeamStorage();
    return $teamStorage->findById($teamId)['name'];
}
?>

<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ETS | Módosítás</title>
    <link rel="stylesheet" href="index.css">
</head>

<body>
    <h1><?= getTeam($match['home']['id']) ?> - <?= getTeam($match['away']['id']) ?></h1>
    <form action="" method="post" novalidate>
        <div>
            <label for="date">Dátum: </label><br>
            <input type="text" name="date" id="date" value="<?= $_POST['date'] ?? "" ?>">
            <?php if (count($_POST) > 0 && $errors['date'] !== '') : ?>
            <span class="error"><?= $errors['date'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <label for="team1">Első csapat eredménye: </label><br>
            <input type="text" name="team1" id="team1" value="<?= $_POST['team1'] ?? "" ?>">
            <?php if (count($_POST) > 0 && $errors['team1'] !== '') : ?>
            <span class="error"><?= $errors['team1'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <label for="team2">Második csapat eredménye: </label><br>
            <input type="text" name="team2" id="team2" value="<?= $_POST['team2'] ?? "" ?>">
            <?php if (count($_POST) > 0 && $errors['team2'] !== '') : ?>
            <span class="error"><?= $errors['team2'] ?></span>
            <?php endif; ?>
        </div>
        <div>
            <button type="submit">Mentés</button>
        </div>
    </form>
</body>

</html>