var dx = 1;
var dy = 1;
var ball_coordinates = null
var ball_top = null
var ball_left = null
var ball_right = null
var ball_bottom = null
var offsets_court = null
var court_top = null
var court_bottom = null
var court_left = null
var court_right = null
var paddle_coordinates = null;
var paddleTop = null;
var paddleBottom = null;
var score = 0;
var high_score = 0;
var interval_id = null;
var original_ball_top_postion = 0;
var original_ball_left_position = 0;

function initialize()
{
    ball_coordinates = document.getElementById('ball').getBoundingClientRect();
    ball_top = ball_coordinates.top;

    ball_left = ball_coordinates.left;
    ball_right = ball_coordinates.right;
    ball_bottom = ball_coordinates.bottom;

    offsets_court = document.getElementById('court').getBoundingClientRect();
    court_top = offsets_court.top;
    court_bottom = offsets_court.bottom;
    court_left = offsets_court.left;
    court_right = offsets_court.right;

}
;
function movePaddle(event) {
    var mousePositionOnYAxis = event.clientY;
    var offsets_court = document.getElementById('court').getBoundingClientRect();
    var courtTop = offsets_court.top;
    var courtBottom = offsets_court.bottom;

    paddle_coordinates = document.getElementById('paddle').getBoundingClientRect()
    paddleTop = paddle_coordinates.top;
    paddleBottom = paddle_coordinates.bottom;
    paddleLeft = paddle_coordinates.left;

    if (mousePositionOnYAxis > courtBottom - 70) {
        document.getElementById("paddle").style.bottom = courtBottom;
    } else if (mousePositionOnYAxis < courtTop + 50) {
        document.getElementById("paddle").style.top = courtTop;
    } else {
        document.getElementById("paddle").style.top = mousePositionOnYAxis - 200 + "px";
    }
}
;

function startGame() {
    if (!interval_id) {
        interval_id = setInterval(moveBall, 1);
    }
}
;

function setSpeed(speed) {
//alert(speed);
    dx = dx * speed;
    dy = dy * speed;
}
;
function reset_game() {
    clearInterval(interval_id);
    var max_score = document.getElementById("score").innerHTML;
//    alert(location.pathname);
    window.location.replace(location.pathname + "?max_score=" + max_score);

}
;

function resetGame() {
    window.location = window.location.href.split("?")[0];
}
function moveBall() {

    if (ball_left >= court_right - 30) {
        alert("Your Score is :" + score);
        if (score > document.getElementById("score").innerHTML) {
            document.getElementById("score").innerHTML = score;
        }
        reset_game();
    }
//    alert(ball_top + '>=' + court_bottom);
    if (ball_top + 266 >= court_bottom || ball_top <= court_top - 240) {
        dy = -dy;
    }

    if (ball_left <= court_left - 10) {
        dx = -dx;
    }

    ball_left = ball_left + dx;
    ball_top = ball_top + dy;
    document.getElementById("ball").style.left = ball_left + 'px'
    document.getElementById("ball").style.top = ball_top + 'px'

    if (paddleLeft <= (ball_left + 31) && (ball_top + 240) >= paddleTop && (ball_top + 240) <= paddleBottom) {
        score++;
        document.getElementById("strikes").innerHTML = score;
        dx = -dx;
        ball_left = ball_left + dx;
        ball_top = ball_top + dy;
        document.getElementById("ball").style.left = ball_left + 'px'
        document.getElementById("ball").style.top = ball_top + 'px'
    }
}
;
