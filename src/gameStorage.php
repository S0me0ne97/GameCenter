<?php
include_once('storage.php');

class GameStorage extends Storage {
    public function __construct()
    {
        parent::__construct(new JsonIO('src/games.json'));
    }
}
?>