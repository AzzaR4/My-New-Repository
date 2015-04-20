var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
 
        // set up some event handlers to process keyboard input
window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);
 
var spawnTimer = 0;
                // DeltaTime
var startFrameMillis = Date.now();
var endFrameMillis = Date.now ();
function getDeltaTime ()      // Only call this function once per frame
{
     endFrameMillis = startFrameMillis;
     startFrameMillis = Date.now();
     var deltaTime = (startFrameMillis = endFrameMillis) * 0.001;
     if (deltaTime > 1)    // validate that the delta time is within range
     {
          deltaTime = 1;
     }
}
 
                        // define some constant values for the game states
                        var STATE_SPLASH = 0;
                        var STATE_GAME = 1;
                        var STATE_GAMEOVER = 2;
                        var gameState = STATE_SPLASH;
 
 
 
 
 
 
                // load the image to use for the tiled background
        var grass = document.createElement("img");
        grass.src = "assets/grass.png";
       
        // create the tiled background
var background = [];
 
for(var y=0;y<15;y++)
{
                background[y] = [];
                for(var x=0; x<20; x++)
                        background[y][x] = grass;
}
 
 
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var ASTEROID_SPEED = 0.8;
var PLAYER_SPEED = 1;
var PLAYER_TURN_SPEED = 0.04;
var BULLET_SPEED = 1.5;
 
 
// this creates the player object and assigns it some properties
var player = {
        image: document.createElement("img"),
        x: SCREEN_WIDTH/2,
        y: SCREEN_HEIGHT/2,
        width: 93,
        height: 80,
        directionX: 0,
        directionY: 0,
        angularDirection: 0,
        rotation: 0
};
 
                // Create an array to store our asteroids
var asteroids = [];
 
 
 
// this creates the bullet object and assigns it some properties
var bullet = {
        image: document.createElement("img"),
        x: player.x,
        y: player.y,
        width: 5,
        height: 5,
        velocityX: 0,
        velocityY: 0,
        isDead: true
};
        // set the image for the asteroid to use
        bullet.image.src = "assets/bullet.png";
 
 
function playerShoot()
{
                // we can only have 1 bullet at a time
        if( bullet.isDead == false )
        return;
                // start off with a velocity that shoots the bullet straight up
        var velX = 0;
        var velY = 1;
                // now rotate this vector acording to the ship's current rotation
        var s = Math.sin(player.rotation);
        var c = Math.cos(player.rotation);
                // for an explanation of this formula,
                // see http://en.wikipedia.org/wiki/Rotation_matrix
        var xVel = (velX * c) - (velY * s);
        var yVel = (velX * s) + (velY * c);
                // dont bother storing a direction and calculating the
                // velocity every frame, because it won't change.
                // Just store the pre-calculated velocity
        bullet.velocityX = xVel * BULLET_SPEED;
        bullet.velocityY = yVel * BULLET_SPEED;
                // don't forget to set the bullet's position
        bullet.x = player.x;
        bullet.y = player.y;
                // make the bullet alive
        bullet.isDead = false;
}      
       
       
 
// set the image for the player to use
player.image.src = "assets/ship.png";
 
        // key constants
        // Go here for a list of key codes:
        // https://developer.mozilla.org/en-US/docs/DOM/KeyboardEvent
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
 
function onKeyDown(event)
{
        if(event.keyCode == KEY_UP)
{
        player.directionY = 1;
}
        if(event.keyCode == KEY_DOWN)
{
        player.directionY = -1;
}
        if(event.keyCode == KEY_LEFT)
{
        player.angularDirection = -1;
}
        if(event.keyCode == KEY_RIGHT)
{
        player.angularDirection = 1;
}
}
 
function onKeyUp(event)
{
        if(event.keyCode == KEY_UP)
{
        player.directionY = 0;
}
        if(event.keyCode == KEY_DOWN)
{
        player.directionY = 0;
}
        if(event.keyCode == KEY_LEFT)
{
        player.angularDirection = 0;
}
        if(event.keyCode == KEY_RIGHT)
{
        player.angularDirection = 0;
}      
        if(event.keyCode == KEY_SPACE)
{
        playerShoot();
}
}
 
 
// tests if two rectangles are intersecting.
// Pass in the x,y coordinates, width and height of each rectangle.
// Returns 'true' if the rectangles are intersecting
function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
        if(y2 + h2 < y1 ||
        x2 + w2 < x1 ||
        x2 > x1 + w1 ||
        y2 > y1 + h1)
{
                return false;
}
        return true;
}
 
 
        var splashTimer = 3;
        function runSplash(deltaTime)
        {
                        splashTimer -= deltaTime;
                        if(splashTimer <= 0)
                        {
                                        gameState = STATE_GAME;
                                        return;
                        }
 
                        context.fillStyle = "#000";
                        context.font="24px Arial";
                        context.fillText("SPLASH SCREEN", 200, 240);
        }
 
        function runGame(deltaTime)
        {
                // draw the tiled background (make sure you do this first, so everything
                // else in the scene will be drawn on top of the tiled background)
for(var y=0; y<15; y++)
{
        for(var x=0; x<20; x++)
        {
                        context.drawImage(background[y][x], x*32, y*32);
        }
}
       
        // update and draw the bullet
        // we want to do this first so that the plane is drawn on
        // top of the bullet
if(bullet.isDead == false)
{
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
        context.drawImage(bullet.image,
                bullet.x - bullet.width/2,
                bullet.y - bullet.height/2);
}
 
                // update all the asterioids in the asteroids array
                for(var i=0; i<asteroids.length; i++)
                {
                        // update the asteroids position according to its current velocity.
                        // TODO: Dont forget to multiply by deltaTime to get a constant speed
                asteroids[i].x = asteroids[i].x + asteroids[i].velocityX;
                asteroids[i].y = asteroids[i].y + asteroids[i].velocityY;
                        // TODO: check if the asteroid has gone out of the screen boundaries
                        // If so, wrap the astroid around the screen so it comes back from the
                        // other side
                }
                // draw all the asteroids
                for(var i=0; i<asteroids.length; i++)
                {
                context.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
                }
                spawnTimer -= deltaTime;
                if(spawnTimer <= 0)
                {
                spawnTimer = 1;
                spawnAsteroid();
                }
 
 
       
       
        // calculate sin and cos for the player's current rotation
        var s = Math.sin(player.rotation);
        var c = Math.cos(player.rotation);
        // figure out what the player's velocity will be based on the current rotation
        // (so that if the ship is moving forward, then it will move forward according to its
        // rotation. Without this, the ship would just move up the screen when we pressed 'up',
        // regardless of which way it was rotated)
        // for an explanation of this formula, see http://en.wikipedia.org/wiki/Rotation_matrix
        var xDir = (player.directionX * c) - (player.directionY * s);
        var yDir = (player.directionX * s) + (player.directionY * c);
        var xVel = xDir * PLAYER_SPEED;
        var yVel = yDir * PLAYER_SPEED;
        player.x += xVel;
        player.y += yVel;
        player.rotation += player.angularDirection * PLAYER_TURN_SPEED;
 
 
 
 
       
       
        // rand(floor, ceil)
        // Return a random number within the range of the two input variables
function rand(floor, ceil)
{
return Math.floor( (Math.random()* (ceil-floor)) +floor );
}
                // Create a new random asteroid and add it to our asteroids array.
                // We'll give the asteroid a random position (just off screen) and
                // set it moving towards the center of the screen
function spawnAsteroid()
{
        // make a random variable to specify which asteroid image to use
        // (small, mediam or large)
        var type = rand(0, 3);
        // create the new asteroid
        var asteroid = {};
        asteroid.image = document.createElement("img");
        asteroid.image.src = "assets/rock_large.png";
        asteroid.width = 69;
        asteroid.height = 75;
        // to set a random position just off screen, we'll start at the centre of the
        // screen then move in a random direction by the width of the screen
        var x = SCREEN_WIDTH/2;
        var y = SCREEN_HEIGHT/2;
        var dirX = rand(-10,10);
        var dirY = rand(-10,10);
        // 'normalize' the direction (the hypotenuse of the triangle formed
        // by x,y will equal 1)
        var magnitude = (dirX * dirX) + (dirY * dirY);
        if(magnitude != 0)
        {
        var oneOverMag = 1 / Math.sqrt(magnitude);
        dirX *= oneOverMag;
        dirY *= oneOverMag;
        }
        // now we can multiply the dirX/Y by the screen width to move that amount from
        // the centre of the screen
        var movX = dirX * SCREEN_WIDTH;
        var movY = dirY * SCREEN_HEIGHT;
        // add the direction to the original position to get the starting position of the
        // asteroid
        asteroid.x = x + movX;
        asteroid.y = y + movY;
        // now, the easy way to set the velocity so that the asteroid moves towards the
        // centre of the screen is to just reverse the direction we found earlier
        asteroid.velocityX = -dirX * ASTEROID_SPEED;
        asteroid.velocityY = -dirY * ASTEROID_SPEED;
        // finally we can add our new asteroid to the end of our asteroids array
        asteroids.push(asteroid);
        }
       
        context.save();
        context.translate(player.x, player.y);
        context.rotate(player.rotation);
        context.drawImage(
        player.image, -player.width/2, -player.height/2);
        context.restore();
}
 
        function runGameOver(deltaTime)
        {
        }
 
 
 
 
 
 
 
 
 
 
 
 
 
function run()
{
        context.fillStyle = "#ccc";
        context.fillRect(0, 0, canvas.width, canvas.height);
       
        var deltaTime = getDeltaTime();
 
                switch(gameState)
        {
                case STATE_SPLASH:
                        runSplash(deltaTime);
                        break;
                case STATE_GAME:
                        runGame(deltaTime);
                        break;
                case STATE_GAMEOVER:
                        runGameOver(deltaTime);
                        break;
        }
}
 
//60FPS framework
(function()
{
var onEachFrame;
 
if (window.requestAnimationFrame)
{
  onEachFrame = function(cb)
  {
   var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
   _cb();
  };
 
}
else if (window.mozRequestAnimationFrame)
        {
        onEachFrame = function(cb) {
                var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
                _cb();
        };
       
}
else
{
        onEachFrame = function(cb)
        {
                setInterval(cb, 1000 / 60);
        }
}
 
        window.onEachFrame = onEachFrame;
})();
 
window.onEachFrame(run);