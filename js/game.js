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

var mySpeech = "Shantam: Keep going on to see some familiar faces and some memories with them! Tap here to continue."
var speechObject = {
    "me" : mySpeech,
    "prabhata" : "Prabhatha: Hey Manasvi! Thank you for being there for me. I admire how unapologetically yourself you are and treat everyone with love, respect and affection. I'm glad you are in my life. Love you! ❤❤",
    "sai" : "Sai: Happy birthday Manasvi!",
    "drushti" : "Drushti: Happy birthday Manasvi!",
    "sateesh" : "Sateesh: Happy birthday Manasvi!",
    "aashina" : "Aashina: Happy birthday Manasvi!",
    "shreya" : "Shreya: Happy Birthday Manuuuu! Here’s wishing you all the happiness in the world, and more. I hope that you do what you love, and achieve all your dreams. You deserve it! I love you & am thankful for you! Cheers!",
    "sudha" : "Sudha: Happy birthday Manu!",
    "me2" : "Shantam: Happy birthday love! Hope to be with you for many more!"
}

var memoryObject = {};
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
var isTalking = false;
var talkingTo = "";
var isCharLimitExceeded = false;
var CHAR_LIMIT = 100;
var start = 0;
var currentSpeechSegment = ""
var textToSet = "";
var currentTextIndex = 0;
var textTimer;

function preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('tiles', 'assets/brick.png');
    this.load.image('layer_1', 'assets/layer_1.png');
    this.load.image('layer_2', 'assets/layer_2.png');
    this.load.image('frame', 'assets/frame.png');
    this.load.image('photome', 'assets/me.png');
    this.load.image('photoprabhata', 'assets/photoprabhatha.png');
    this.load.image('photosai', 'assets/me.png');
    this.load.image('photodrushti', 'assets/photodrushti.png');
    this.load.image('photosateesh', 'assets/photosateesh.png');
    this.load.image('photoaashina', 'assets/me.png');
    this.load.image('photoshreya', 'assets/photoshreya.png');
    this.load.image('photoasudha', 'assets/photosudha.png');
    this.load.spritesheet('birthday', 'assets/birthday.png',{ frameWidth: 500, frameHeight: 527 });
    this.load.spritesheet('me', 'assets/prince.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('char', 'assets/bae.png', { frameWidth: assetWidth, frameHeight: assetHeight });
    this.load.spritesheet('prabhata', 'assets/prabhata.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sai', 'assets/sai.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('drushti', 'assets/drushti.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('aashina', 'assets/aashina.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sateesh', 'assets/sateesh.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sudha', 'assets/sudha.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('shreya', 'assets/shreya.png',{ frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('buttons', 'assets/buttons.png', { frameWidth: buttonWidth, frameHeight: buttonHeight });
}

function create() {
    //  Frame debug view

    if (!window.mobilecheck()) {
        document.getElementById("block").style.display = "block";
        document.getElementsByTagName("canvas")[0].style.visibility = "hidden";
    }
    // frameView = this.add.graphics({ fillStyle: { color: 0xff00ff }, x: 32, y: 32 });
    // document.getElementsByTagName('canvas')[0].style.transform = "translateY(" + (1280-window.screen.availHeight)/2*window.devicePixelRatio + "px)"
    sky = this.add.image(1280,600, 'layer_1').setScale(1);
    sky1 = this.add.image(sky.width,600, 'layer_1').setScale(1);
    sky2 = this.add.image(sky.width+sky1.width,600, 'layer_1').setScale(1);
    sky3 = this.add.image(sky.width+sky1.width+sky2.width,600, 'layer_1').setScale(1);

    bg = this.add.image(1280,760, 'layer_2').setScale(1);
    bg1 = this.add.image(bg.width,760, 'layer_2').setScale(1);
    bg2 = this.add.image(bg.width+bg1.width,760, 'layer_2').setScale(1);
    bg3 = this.add.image(bg.width+bg1.width+bg2.width,760, 'layer_2').setScale(1);
    map = this.make.tilemap({ key: 'map' });

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('floorset', 'tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('floor', groundTiles, 0, 1280 - 200).setScale(scaleRatio, scaleRatio);
    groundLayer2 = map.createDynamicLayer('floor2', groundTiles, groundLayer.width, 1280 - 200).setScale(scaleRatio, scaleRatio);
    groundLayer3 = map.createDynamicLayer('floor3', groundTiles, groundLayer.width + groundLayer2.width, 1280 - 200).setScale(scaleRatio, scaleRatio);
    groundLayer4 = map.createDynamicLayer('floor4', groundTiles, groundLayer.width + groundLayer2.width +groundLayer3.width , 1280 - 200).setScale(scaleRatio, scaleRatio);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);
    groundLayer2.setCollisionByExclusion([-1]);
    groundLayer3.setCollisionByExclusion([-1]);
    groundLayer4.setCollisionByExclusion([-1]);

    

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width + groundLayer2.width + groundLayer3.width + groundLayer4.width;
    var config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('char'),
        frameRate: 6,
        yoyo: false,
        repeat: -1
    };

    var configBirthday = {
        key: 'birthday',
        frames: this.anims.generateFrameNumbers('birthday'),
        frameRate: 6,
        yoyo: false,
        repeat: -1
    };

    anim = this.anims.create(config);
    animBirthday = this.anims.create(configBirthday);
    birthday = this.add.sprite(6085,300, 'birthday').setScale(1,1);
    birthday.anims.load('birthday');
    birthday.anims.play('birthday');
    // birthday.anims.pause();
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
        nextTextBox();
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
    this.physics.add.collider(groundLayer3, me);
    this.physics.add.collider(groundLayer4, me);
    me.setInteractive();
    me.on('pointerdown', function () {
        currentTextIndex = 0;
        isTalking = true;
        talkingTo = "me";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    })

    prabhata = this.physics.add.sprite(1280,0, 'prabhata').setScale(scaleRatio, scaleRatio);
    prabhata.setBounce(0.2);
    prabhata.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, prabhata);
    this.physics.add.collider(groundLayer2, prabhata);
    this.physics.add.collider(groundLayer3, prabhata);
    this.physics.add.collider(groundLayer4, prabhata);
    prabhata.setInteractive();
    prabhata.on('pointerdown', function () {
        isTalking = true;
        talkingTo = "prabhata";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });

    sai = this.physics.add.sprite(1920,0, 'sai').setScale(scaleRatio, scaleRatio);
    sai.setBounce(0.2);
    sai.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, sai);
    this.physics.add.collider(groundLayer2, sai);
    this.physics.add.collider(groundLayer3, sai);
    this.physics.add.collider(groundLayer4, sai);
    sai.setInteractive();
    sai.on('pointerdown', function () {
        isTalking = true;
        talkingTo = "sai";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });

    drushti = this.physics.add.sprite(2560,0, 'drushti').setScale(scaleRatio, scaleRatio);
    drushti.setBounce(0.2);
    drushti.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, drushti);
    this.physics.add.collider(groundLayer2, drushti);
    this.physics.add.collider(groundLayer3, drushti);
    this.physics.add.collider(groundLayer4, drushti);
    drushti.setInteractive();
    drushti.on('pointerdown', function () {
        isTalking = true;
        talkingTo = "drushti";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });


    sateesh = this.physics.add.sprite(3200,0, 'sateesh').setScale(scaleRatio, scaleRatio);
    sateesh.setBounce(0.2);
    sateesh.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, sateesh);
    this.physics.add.collider(groundLayer2, sateesh);
    this.physics.add.collider(groundLayer3, sateesh);
    this.physics.add.collider(groundLayer4, sateesh);
    sateesh.setInteractive();
    sateesh.on('pointerdown', function () {
        currentTextIndex = 0;
        isTalking = true;
        talkingTo = "sateesh";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });

    aashina = this.physics.add.sprite(3840,0, 'aashina').setScale(scaleRatio, scaleRatio);
    aashina.setBounce(0.2);
    aashina.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, aashina);
    this.physics.add.collider(groundLayer2, aashina);
    this.physics.add.collider(groundLayer3, aashina);
    this.physics.add.collider(groundLayer4, aashina);
    aashina.setInteractive();
    aashina.on('pointerdown', function () {
        currentTextIndex = 0;
        isTalking = true;
        talkingTo = "aashina";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });


    shreya = this.physics.add.sprite(4480,0, 'shreya').setScale(scaleRatio, scaleRatio);
    shreya.setBounce(0.2);
    shreya.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, shreya);
    this.physics.add.collider(groundLayer2, shreya);
    this.physics.add.collider(groundLayer3, shreya);
    this.physics.add.collider(groundLayer4, shreya);
    shreya.setInteractive();
    shreya.on('pointerdown', function () {
        currentTextIndex = 0;
        isTalking = true;
        talkingTo = "shreya";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });


    sudha = this.physics.add.sprite(5120,0, 'sudha').setScale(scaleRatio, scaleRatio);
    sudha.setBounce(0.2);
    sudha.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, sudha);
    this.physics.add.collider(groundLayer2, sudha);
    this.physics.add.collider(groundLayer3, sudha);
    this.physics.add.collider(groundLayer4, sudha);
    sudha.setInteractive();
    sudha.on('pointerdown', function () {
        isTalking = true;
        talkingTo = "sudha";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    });

    me2 = this.physics.add.sprite(5960,0, 'me').setScale(scaleRatio, scaleRatio);
    me2.setBounce(0.2);
    me2.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, me2);
    this.physics.add.collider(groundLayer2, me2);
    this.physics.add.collider(groundLayer3, me2);
    this.physics.add.collider(groundLayer4, me2);
    me2.setInteractive();
    me2.on('pointerdown', function () {
        currentTextIndex = 0;
        isTalking = true;
        talkingTo = "me2";
        memoryObject[talkingTo].body.velocity.y =  - 10;
    })


    memory = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photome').setScale(1.5);
    this.physics.add.collider(groundLayer, memory);
    this.physics.add.collider(groundLayer2, memory);
    this.physics.add.collider(groundLayer3, memory);
    this.physics.add.collider(groundLayer4, memory);
    memory.setScrollFactor(0);

    memoryP = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photoprabhata').setScale(1.5);
    this.physics.add.collider(groundLayer, memoryP);
    this.physics.add.collider(groundLayer2, memoryP);
    this.physics.add.collider(groundLayer3, memoryP);
    this.physics.add.collider(groundLayer4, memoryP);
    memoryP.setScrollFactor(0);

    memorySai = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photosai').setScale(1.5);
    this.physics.add.collider(groundLayer, memorySai);
    this.physics.add.collider(groundLayer2, memorySai);
    this.physics.add.collider(groundLayer3, memorySai);
    this.physics.add.collider(groundLayer4, memorySai);
    memorySai.setScrollFactor(0);

    memoryDrushti = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photodrushti').setScale(1.5);
    this.physics.add.collider(groundLayer, memoryDrushti);
    this.physics.add.collider(groundLayer2, memoryDrushti);
    this.physics.add.collider(groundLayer3, memoryDrushti);
    this.physics.add.collider(groundLayer4, memoryDrushti);
    memoryDrushti.setScrollFactor(0);

    memorySateesh = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photosateesh').setScale(1.5);
    this.physics.add.collider(groundLayer, memorySateesh);
    this.physics.add.collider(groundLayer2, memorySateesh);
    this.physics.add.collider(groundLayer3, memorySateesh);
    this.physics.add.collider(groundLayer4, memorySateesh);
    memorySateesh.setScrollFactor(0);

    memoryAashina = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photoaashina').setScale(1.5);
    this.physics.add.collider(groundLayer, memoryAashina);
    this.physics.add.collider(groundLayer2, memoryAashina);
    this.physics.add.collider(groundLayer3, memoryAashina);
    this.physics.add.collider(groundLayer4, memoryAashina);
    memoryAashina.setScrollFactor(0);

    memoryShreya = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photoshreya').setScale(1.5);
    this.physics.add.collider(groundLayer, memoryShreya);
    this.physics.add.collider(groundLayer2, memoryShreya);
    this.physics.add.collider(groundLayer3, memoryShreya);
    this.physics.add.collider(groundLayer4, memoryShreya);
    memoryShreya.setScrollFactor(0);

    memorySudha = this.physics.add.sprite(this.cameras.main.width / 2, 1280-1100, 'photoasudha').setScale(1.5);
    this.physics.add.collider(groundLayer, memorySudha);
    this.physics.add.collider(groundLayer2, memorySudha);
    this.physics.add.collider(groundLayer3, memorySudha);
    this.physics.add.collider(groundLayer4, memorySudha);
    memorySudha.setScrollFactor(0);

    memoryObject = {
        "me" : memory,
        "prabhata" : memoryP,
        "sai" : memorySai,
        "drushti" : memoryDrushti,
        "sateesh" : memorySateesh,
        "aashina" : memoryAashina,
        "shreya" : memoryShreya,
        "sudha" : memorySudha
    }
    // memory.setCollideWorldBounds(true);
    // memory = this.add.image(this.cameras.main.width / 2, 1280-1000, 'photome');
    // memory.body.velocity.y =  - 10;
    hideMemory();
    hideTextBox();

    this.input.on('pointerup', function (pointer) {
        sprite.anims.pause();
        sprite.body.setVelocityX(0)
        isMovingForward = false;
    });
    console.log(sprite);

    sprite.anims.play('walk');
    sprite.anims.pause();
    document.getElementsByTagName('canvas')[0].style.top = ((window.screen.availHeight*window.devicePixelRatio)- 1280)/2+"px";

}

function updateFrameView() {
    // frameView.clear();
    // frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
}

function update() {
    if (isMovingForward) {
        sprite.anims.resume();
        sprite.body.setVelocityX(200)
    }
    if (isTalking) {
        var speechToShow = speechObject[talkingTo].slice(start, start+100);
        var memoryToShow = memoryObject[talkingTo];
        if(currentTextIndex === 0){
            showTextBox(speechToShow)
        }
        if(!textTimer){
            textTimer = this.time.addEvent({
                delay: 50,                // ms
                callback: showTextBox,
                //args: [],
                args: [ speechToShow],
                repeat: speechToShow.length
            });
        }
        
        // showTextBox();
        if(memoryToShow){
            memoryToShow.body.velocity.y =  memoryToShow.body.velocity.y - 8.8;
            showMemory(memoryToShow);
        }
    }
    
}

function showTextBox(string){
    text.visible = true;
    // text.setText(textToSet);
    var settingText = string.slice(0, currentTextIndex++);
    text.setText(settingText);

    frame.visible = true;
    forward.visible = false;
}

function nextTextBox(){
    if(currentTextIndex < speechObject[talkingTo].length && start < (speechObject[talkingTo].length - CHAR_LIMIT)){
        start = start + CHAR_LIMIT;
        if(textTimer){
            textTimer.remove();
            textTimer.destroy();
            textTimer = null;
        }
        currentTextIndex = 0;
    }else{
        hideTextBox();
        hideMemory();
    }
    
}

function hideTextBox(){
    isTalking = false;
    if(textTimer){
        textTimer.remove();
        textTimer.destroy();
        textTimer = null;
    }
    start = 0;
    currentTextIndex = 0;
    isCharLimitExceeded = false;
    text.visible = false;
    frame.visible = false;
    forward.visible = true;
}

function showMemory(memoryPassed){
    memoryPassed.visible = true;
}

function hideMemory(){
    var allMemories = Object.keys(memoryObject);
    for(var i=0; i< allMemories.length; i++){
        memoryObject[allMemories[i]].visible = false;
        memoryObject[allMemories[i]].visible = false;
        memoryObject[allMemories[i]].y = 1280-1100;
        memoryObject[allMemories[i]].body.velocity.y  = 0;
    }


}