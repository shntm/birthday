var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: window.screen.availWidth * window.devicePixelRatio,
    height: window.screen.availHeight * window.devicePixelRatio,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
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

function preload ()
{
    this.load.spritesheet('char', '5.png', { frameWidth: assetWidth, frameHeight: assetWidth });
    this.load.spritesheet('buttons', 'buttons.png', { frameWidth: buttonWidth, frameHeight: buttonHeight });
}

function create ()
{
    //  Frame debug view

    // frameView = this.add.graphics({ fillStyle: { color: 0xff00ff }, x: 32, y: 32 });

    //  Show the whole animation sheet
    // this.add.image(32, 32, 'char', '__BASE').setOrigin(0);

    var config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('char'),
        frameRate: 6,
        yoyo: true,
        repeat: -1
    };

    anim = this.anims.create(config);

    console.log(anim);

    sprite = this.add.sprite((window.screen.availWidth * window.devicePixelRatio)/2 - (assetWidth/2), (window.screen.availHeight * window.devicePixelRatio)/2- (assetWidth/2), 'char').setScale(scaleRatio, scaleRatio);
    sprite.anims.load('walk');
    forward = this.add.image((window.screen.availWidth * window.devicePixelRatio)/2 - (assetWidth/2), (window.screen.availHeight * window.devicePixelRatio)*0.75, 'buttons', 1).setScale(scaleRatio, scaleRatio);
    forward.setInteractive();
    forward.on('pointerdown', function(){
        isMovingForward = true;
    })
    forward.on('pointerup', function(){
        sprite.anims.pause();
        isMovingForward = false;
    })
    this.input.on('pointerup', function(pointer){
        console.log("helllo");
        sprite.anims.pause();
        isMovingForward = false;
     });
    console.log(sprite);

    sprite.anims.play('walk');
    sprite.anims.pause();

    this.input.keyboard.on('keydown_SPACE', function (event) {

        sprite.anims.play('walk');

    });

    this.input.keyboard.on('keydown_P', function (event) {

        if (sprite.anims.isPaused)
        {
            sprite.anims.resume();
        }
        else
        {
            sprite.anims.pause();
        }

    });

    this.input.keyboard.on('keydown_R', function (event) {

        sprite.anims.restart();

    });

}

function updateFrameView ()
{
    // frameView.clear();
    // frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
}

function update ()
{
    if(isMovingForward){
        // sprite.anims.restart();
        // console.log("walking")
        sprite.anims.resume();
    }
}
