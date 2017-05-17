var canvas = document.getElementById("SnakeCanvas");
var ctx = canvas.getContext("2d");

//============================================================================//

var snake = {
    head: { x: 10, y: 10 },
    dir: { x: 0, y: 0 },
    tail: [ { x: 10, y: 10 } ],
    lumps: [ ]
};

var food = {
    pos: { x: 10, y: 10 },
    reset: true
};

var keyboard = [];
var handled = false;

//============================================================================//

function equals(posA, posB)
{
    return posA.x == posB.x && posA.y == posB.y;
}

function get_random_int(min, max)
{
  min = Math.ceil(min); max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function draw_dot(pos)
{
    ctx.strokeRect(pos.x * 20 + 10.5, pos.y * 20 + 10.5, 19, 19);
    ctx.fillRect(pos.x * 20 + 11, pos.y * 20 + 11, 18, 18);
}

//============================================================================//

function refresh()
{    
    //========================================================//

    // update snake head position

    snake.head.x += snake.dir.x;
    snake.head.y += snake.dir.y;
    
    //========================================================//

    // check for collision with tail and edges

    if (snake.dir.x != 0 || snake.dir.y != 0)
    {
        if (snake.tail.some(elem => equals(snake.head, elem)))
            end_game();
    
        if (snake.head.x < 0 || snake.head.x > 20) end_game();
        if (snake.head.y < 0 || snake.head.y > 20) end_game();
    }
    
    //========================================================//

    // add to the snake's tail

    snake.tail.splice(0, 0, {});
    snake.tail[0].x = snake.head.x;
    snake.tail[0].y = snake.head.y;
    
    //========================================================//

    // update food position
    
    if (food.reset == true)
    {
        while (snake.tail.some(elem => equals(food.pos, elem)))
        {
            food.pos.x = get_random_int(0, 20);
            food.pos.y = get_random_int(0, 20);
        }

        food.reset = false;
    }
    
    //========================================================//

    // remove either a tail element or a lump

    if (snake.lumps.length == 0 || !equals(snake.lumps[snake.lumps.length - 1], snake.tail[snake.tail.length - 1]))
        snake.tail.pop();
    else
        snake.lumps.pop();

    //========================================================//
    
    // check if the snake found the food

    if (equals(snake.head, food.pos))
    {
        snake.lumps.splice(0, 0, {});
        snake.lumps[0].x = food.pos.x;
        snake.lumps[0].y = food.pos.y;
        
        food.reset = true;
    }
    
    //========================================================//

    // draw border and background

    ctx.fillStyle = "#552211";
    ctx.fillRect(0, 0, 440, 440);

    ctx.strokeStyle = "#AA5544";
    ctx.strokeRect(0.5, 0.5, 439, 439);
    ctx.strokeRect(9.5, 9.5, 421, 421);

    ctx.fillStyle = "#AABB99";
    ctx.fillRect(10, 10, 420, 420);
    
    //========================================================//

    ctx.strokeStyle = "#556644";

    // draw the snake
    ctx.fillStyle = "#223311";
    snake.tail.forEach(draw_dot);
    
    // draw the food
    ctx.fillStyle = "#667755";
    draw_dot(food.pos);
    
    // draw the lumps    
    ctx.fillStyle = "#445533";
    snake.lumps.forEach(draw_dot);
    
    //========================================================//

    // reset input handling

    handled = false;
}

//============================================================================//

function end_game()
{
    alert("GAME OVER\nScore: " + snake.tail.length);
    window.location.reload(false);
}

//============================================================================//

function handle_keydown(event)
{
    if (handled || keyboard[event.keyCode]) return;
    keyboard[event.keyCode] = true;

    if (event.keyCode == 37 && snake.dir.x == 0) { snake.dir.x = -1; snake.dir.y = 0; handled = true; }
    if (event.keyCode == 39 && snake.dir.x == 0) { snake.dir.x = +1; snake.dir.y = 0; handled = true; }
    if (event.keyCode == 38 && snake.dir.y == 0) { snake.dir.x = 0; snake.dir.y = -1; handled = true; }
    if (event.keyCode == 40 && snake.dir.y == 0) { snake.dir.x = 0; snake.dir.y = +1; handled = true; }
}

function handle_keyup(event)
{
    keyboard[event.keyCode] = false;
}

//============================================================================//

window.addEventListener("keydown", handle_keydown);
window.addEventListener("keyup", handle_keyup);

window.setInterval(refresh, 250);
