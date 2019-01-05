var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 640,
    height: 1280,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
var anim;
var sprite;
var progress;
var frameView;
var assetWidth = 32;
var assetHeight = 32;
var buttonWidth = 16;
var buttonHeight = 16;
var isMovingForward = false;
var scaleRatio = window.devicePixelRatio * 2;
var isTextBoxVisible = false;
var textToSet = "Hi love! Keep going on to see some familiar faces!"

function preload() {
    this.load.tilemapTiledJSON('map', 'map.json');
    this.load.image('tiles', 'brick.png');
    this.load.image('frame', 'frame.png');
    this.load.spritesheet('me', 'prince.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('char', 'girl.png', { frameWidth: assetWidth, frameHeight: assetHeight });
    this.load.spritesheet('buttons', 'buttons.png', { frameWidth: buttonWidth, frameHeight: buttonHeight });
}

function create() {
    //  Frame debug view

    // frameView = this.add.graphics({ fillStyle: { color: 0xff00ff }, x: 32, y: 32 });

    map = this.make.tilemap({ key: 'map' });

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('floorset', 'tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('floor', groundTiles, 0, 1280 - 200).setScale(scaleRatio, scaleRatio);
    groundLayer2 = map.createDynamicLayer('floor2', groundTiles, groundLayer.width, 1280 - 200).setScale(scaleRatio, scaleRatio);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);
    groundLayer2.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width + groundLayer2.width;
    var config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('char'),
        frameRate: 6,
        yoyo: false,
        repeat: -1
    };

    anim = this.anims.create(config);

    console.log(anim);

    // layer = this.physics.add.sprite(200, 200, 'char'); 
    sprite = this.physics.add.sprite(0,0, 'char').setScale(scaleRatio, scaleRatio);
    sprite.setBounce(0.2);
    sprite.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, sprite);
    this.physics.add.collider(groundLayer2, sprite);
    sprite.anims.load('walk');
    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(sprite);
    this.cameras.main.setBackgroundColor('#ccccff');
    frame = this.add.image(this.cameras.main.width / 2, 1280 - 110, 'frame').setScale(1, 0.7);
    frame.setScrollFactor(0);
    frame.setInteractive();
    frame.on('pointerdown', function () {
        isTextBoxVisible = false;
    });
    text = this.add.text(20, 1280-180, "nauisdkfnkasd", { font: "11px Arial", fill: "#19de65", wordWrap: true, wordWrapWidth: 450 }).setScale(window.devicePixelRatio);
    text.setWordWrapWidth(200);
    text.setScrollFactor(0);
    forward = this.add.image(this.cameras.main.width / 2 - (assetWidth / 2), 1280-100, 'buttons', 1).setScale(scaleRatio, scaleRatio);
    forward.setInteractive();
    forward.setScrollFactor(0);
    forward.on('pointerdown', function () {
        isMovingForward = true;
    })
    forward.on('pointerup', function () {
        sprite.anims.pause();
        sprite.body.setVelocityX(0)
        isMovingForward = false;
    })

    me = this.physics.add.sprite(640,0, 'me').setScale(scaleRatio, scaleRatio);
    me.setBounce(0.2);
    me.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, me);
    this.physics.add.collider(groundLayer2, me);
    me.setInteractive();
    me.on('pointerdown', function () {
        isTextBoxVisible = true;
    })

    this.input.on('pointerup', function (pointer) {
        console.log("helllo");
        sprite.anims.pause();
        sprite.body.setVelocityX(0)
        isMovingForward = false;
    });
    console.log(sprite);

    sprite.anims.play('walk');
    sprite.anims.pause();

}

function updateFrameView() {
    // frameView.clear();
    // frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
}

function update() {
    if (isMovingForward) {
        // sprite.anims.restart();
        // console.log("walking")
        sprite.anims.resume();
        sprite.body.setVelocityX(200)
        // forward.setPosition(this.cameras.main.width / 2 - (assetWidth/2), this.cameras.main.height / 2); 
    }
    if (isTextBoxVisible) {
        // sprite.anims.restart();
        // console.log("walking")
        frame.visible = true;
        forward.visible = false;
        text.visible = true;
        // forward.setPosition(this.cameras.main.width / 2 - (assetWidth/2), this.cameras.main.height / 2); 
    }else{
        frame.visible = false;
        forward.visible = true;
        text.visible = false;
        text.setText(textToSet);
    }
}
