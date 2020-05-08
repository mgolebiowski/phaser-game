import Phaser from "phaser";

var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  backgroundColor: "#bfcc00",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var car;
var cursors;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");

  this.load.image("body", "assets/sprites/car.png");
}

function create() {
  var Car = new Phaser.Class({
    initialize: function Car(scene, x, y) {
      this.headPosition = new Phaser.Geom.Point(x, y);

      this.body = scene.add.group();

      this.head = this.body.create(x, y, "body");

      this.alive = true;

      this.speed = 100;

      this.moveTime = 0;

      this.heading = UP;
      this.direction = UP;
    },

    update: function (time) {
      if (time >= this.moveTime) {
        return this.move(time);
      }
    },

    faceLeft: function () {
      if (this.direction === UP || this.direction === DOWN) {
        this.head.rotation = 1.5*Math.PI;
        this.heading = LEFT;
      }
    },

    faceRight: function () {
      if (this.direction === UP || this.direction === DOWN) {
        this.head.rotation = 0.5*Math.PI;
        this.heading = RIGHT;
      }
    },

    faceUp: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.head.rotation = 2*Math.PI;
        this.heading = UP;
      }
    },

    faceDown: function () {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.head.rotation = 1*Math.PI;
        this.heading = DOWN;
      }
    },

    move: function (time) {
      switch (this.heading) {
        case LEFT:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x - 1,
            0,
            40
          );
          break;

        case RIGHT:
          this.headPosition.x = Phaser.Math.Wrap(
            this.headPosition.x + 1,
            0,
            40
          );
          break;

        case UP:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y - 1,
            0,
            30
          );
          break;

        case DOWN:
          this.headPosition.y = Phaser.Math.Wrap(
            this.headPosition.y + 1,
            0,
            30
          );
          break;
      }

      this.direction = this.heading;

      //  Update the body segments
      Phaser.Actions.ShiftPosition(
        this.body.getChildren(),
        this.headPosition.x * 16,
        this.headPosition.y * 16,
        1
      );

      //  Update the timer ready for the next movement
      this.moveTime = time + this.speed;

      return true;
    },
  });

  car = new Car(this, 8, 8);

  //  Create our keyboard controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update(time) {
  if (cursors.left.isDown) {
    car.faceLeft();
  } else if (cursors.right.isDown) {
    car.faceRight();
  } else if (cursors.up.isDown) {
    car.faceUp();
  } else if (cursors.down.isDown) {
    car.faceDown();
  }

  car.update(time);
}
