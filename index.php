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
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><img src="media/logo.png" alt="Logo"></li>
            <li><a href="index.php">Kezdőlap</a></li>
            <li><a href="src/categories.php">Kategóriák</a></li>
            <li><a href="src/contact.php">Kapcsolat</a></li>
            <?php if(!$auth->is_authenticated()) : ?>
                <li><a id="right" href="src/login.php">Bejelentkezés</a></li>
            <?php else : ?>
                <li><a href="src/profile.php">Profil</a></li>
                <li><a id="right" href="src/logout.php">Kijelentkezés</a></li>
            <?php endif ?>
        </ul> 
    </nav>

    <h1 id="title">Gaming Center</h1>

    <div class="body">
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa enim nec dui nunc. Amet mauris commodo quis imperdiet massa tincidunt. Tellus molestie nunc non blandit. Pellentesque nec nam aliquam sem et tortor consequat. Sit amet consectetur adipiscing elit. Fermentum iaculis eu non diam phasellus. Diam vel quam elementum pulvinar etiam non quam. Vel pharetra vel turpis nunc eget lorem dolor sed. Pretium fusce id velit ut tortor. Nunc sed id semper risus in hendrerit. Et ligula ullamcorper malesuada proin libero nunc consequat interdum. Ipsum faucibus vitae aliquet nec ullamcorper. Purus in massa tempor nec feugiat nisl pretium. Vitae turpis massa sed elementum tempus egestas sed sed risus. Amet aliquam id diam maecenas.
        <br>
        <br>
        Senectus et netus et malesuada fames ac. Pharetra pharetra massa massa ultricies mi quis. Dictum sit amet justo donec enim diam vulputate. Viverra suspendisse potenti nullam ac. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Praesent elementum facilisis leo vel fringilla. Sollicitudin ac orci phasellus egestas. Mi eget mauris pharetra et ultrices. Amet dictum sit amet justo donec enim diam vulputate ut. Pretium viverra suspendisse potenti nullam.
        <br>
        <br>
        Id leo in vitae turpis massa. Risus in hendrerit gravida rutrum quisque non. Sed odio morbi quis commodo odio. Montes nascetur ridiculus mus mauris vitae ultricies. Amet cursus sit amet dictum sit amet justo donec. Nam libero justo laoreet sit. Ultricies integer quis auctor elit sed vulputate mi sit. At in tellus integer feugiat scelerisque varius morbi. Vitae aliquet nec ullamcorper sit amet. Justo donec enim diam vulputate ut pharetra sit. Cursus mattis molestie a iaculis at. Iaculis at erat pellentesque adipiscing commodo. In egestas erat imperdiet sed euismod.
        <br>
        <br>
        Et netus et malesuada fames. Faucibus in ornare quam viverra. Nunc sed id semper risus in hendrerit. Tristique risus nec feugiat in fermentum posuere. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Ac orci phasellus egestas tellus rutrum tellus pellentesque. Turpis in eu mi bibendum neque egestas congue quisque. Viverra orci sagittis eu volutpat. Enim sit amet venenatis urna cursus eget nunc scelerisque. A diam maecenas sed enim ut sem viverra aliquet. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Vitae suscipit tellus mauris a diam maecenas.
        <br>
        <br>
        Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt augue interdum velit euismod in pellentesque. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sagittis orci a scelerisque purus. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Massa tincidunt nunc pulvinar sapien. Vestibulum sed arcu non odio euismod lacinia at. Proin sagittis nisl rhoncus mattis rhoncus urna. Et ligula ullamcorper malesuada proin libero nunc. Ut porttitor leo a diam sollicitudin. Arcu felis bibendum ut tristique et egestas quis. Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas. Tincidunt id aliquet risus feugiat in. Tincidunt praesent semper feugiat nibh sed pulvinar proin. Lacus vel facilisis volutpat est velit egestas. Vel eros donec ac odio tempor orci dapibus. Risus in hendrerit gravida rutrum quisque non.
        </p>
    </div>

    <footer>
        <p>  
            Készítette: Vida Bálint - E93R1V
        </p>
    </footer>
</body>
</html>