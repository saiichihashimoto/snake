$(function() {
    var HEIGHT = 30;
    var WIDTH = 30;
    var SIZE = 20;

    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_RIGHT = 39;
    var KEY_DOWN = 40;

    var H = 72;
    var J = 74;
    var K = 75;
    var L = 76;

    var INTERVAL_SPEED = 50;

    var grid = $('<div class="grid"></div>')
        .appendTo('body')
        .css('height', HEIGHT * SIZE)
        .css('width', WIDTH * SIZE);

    for (var y = 0; y < HEIGHT; y++) {
        var row = $('<div class="row"></div>')
            .appendTo(grid)
            .css('width', WIDTH * SIZE);
        for (var x = 0; x < WIDTH; x++) {
            var cell = $('<span class="cell" id="cell_' + y + '_' + x + '"></span>')
                .appendTo(row)
                .css('height', SIZE)
                .css('width', SIZE);
        }
    }

    var snake = [{ y: 15, x: 15 }];
    var direction = { y: 1, x: 0 };
    var next_direction = null;
    $('#cell_' + snake[0].y + '_' + snake[0].x).addClass('snake').addClass('snake-head');

    var food;
    while (true) {
        food = { y: Math.floor(Math.random() * HEIGHT), x: Math.floor(Math.random() * WIDTH) };
        if (food.y !== snake[0].y || food.x !== snake[0].x) {
            break;
        }
    }
    $('#cell_' + food.y + '_' + food.x).addClass('food');

    var interval = setInterval(function() {
        $('#cell_' + snake[snake.length - 1].y + '_' + snake[snake.length - 1].x).removeClass('snake');
        for (var i = snake.length - 1; i > 0; i--) {
            snake[i].y = snake[i - 1].y;
            snake[i].x = snake[i - 1].x;
        }
        if (next_direction) {
            direction = next_direction;
            next_direction = null;
        }
        $('#cell_' + snake[0].y + '_' + snake[0].x).removeClass('snake-head');
        snake[0].y = (snake[0].y + direction.y + HEIGHT) % HEIGHT;
        snake[0].x = (snake[0].x + direction.x + WIDTH) % WIDTH;
        $('#cell_' + snake[0].y + '_' + snake[0].x).addClass('snake').addClass('snake-head');

        for (var i = 1; i < snake.length; i++) {
            if (snake[0].y === snake[i].y && snake[0].x === snake[i].x) {
                ga('send', 'event', 'snake', 'lost');
                clearInterval(interval);
                return;
            }
        }

        if (snake[0].y === food.y && snake[0].x === food.x) {
            snake.push({ y: snake[snake.length - 1].y, x: snake[snake.length - 1].x });
            ga('send', 'event', 'snake', 'ate', 'food', snake.length);
            $('#cell_' + food.y + '_' + food.x).removeClass('food');
            while (true) {
                food = { y: Math.floor(Math.random() * HEIGHT), x: Math.floor(Math.random() * WIDTH) };
                var breakit = true;
                for (var i = 0; i < snake.length; i++) {
                    if (food.y === snake[i].y && food.x === snake[i].x) {
                        breakit = false;
                        break;
                    }
                }
                if (breakit) {
                    break;
                }
            }
            $('#cell_' + food.y + '_' + food.x).addClass('food');
        }
    }, INTERVAL_SPEED);

    $(document).on('keydown', function(e) {
        switch (e.which) {
            case KEY_LEFT:
            case H:
                if (snake.length > 1 && direction.x > 0) {
                    return;
                }
                next_direction = { y: 0, x: -1 };
                break;
            case KEY_UP:
            case K:
                if (snake.length > 1 && direction.y > 0) {
                    return;
                }
                next_direction = { y: -1, x: 0 };
                break;
            case KEY_RIGHT:
            case L:
                if (snake.length > 1 && direction.x < 0) {
                    return;
                }
                next_direction = { y: 0, x: 1 };
                break;
            case KEY_DOWN:
            case J:
                if (snake.length > 1 && direction.y < 0) {
                    return;
                }
                next_direction = { y: 1, x: 0 };
                break;
            default:
                return;
        }
        e.preventDefault();
    });
});
