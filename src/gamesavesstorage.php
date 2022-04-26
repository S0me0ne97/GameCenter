<?php
include_once('storage.php');

class GameSavesStorage extends Storage {
    public function __construct()
    {
        parent::__construct(new JsonIO('src/gamesaves.json'));
    }
}
?>