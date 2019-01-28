//@todo you can also make left right road bit dynamiz or zig zag shape inside moveRoad func.
const btnStart = document.querySelector(".btnStart");
const speedDash = document.querySelector(".speedDash");
const scoreDash = document.querySelector(".scoreDash");
const lifeDash = document.querySelector(".lifeDash");
const container = document.getElementById("container");
//game variable
let gamePlay = false;
let gameAnimation;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}; 
let player;

//adding Event listener
btnStart.addEventListener("click", startGame);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);

//function releated to game

//function start game
//this function run only one when user click start button
function startGame(){
    container.innerHTML = "";
    btnStart.style.display = 'none';
    var div = document.createElement('div');
    div.setAttribute("class","playerCar");
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    gamePlay = true;
    gameAnimation = requestAnimationFrame(playGame);
    player = {
        ele:div,
        speed:0,
        lives:3,
        gameScore:0,
        carstoPass:10,
        score:0,
        roadwidth:250,
        gameEndCounter:0
    }
    startBoard();
    badCars(10);
}

//badCars func.
function badCars(num){
    for(let x= 0; x<num; x++){
        let temp = 'badCars'+(x+1);
        let div = document.createElement('div');
        div.innerHTML= (x+1);
        div.setAttribute('class','baddy');
        div.setAttribute('id',temp);
        makeBad(div);
        container.appendChild(div);
    }
}

//makingBad Car
function makeBad(elem){
    let tempRoad = document.querySelector('.road');
    elem.style.left = tempRoad.offsetLeft+Math.ceil(Math.random()*tempRoad.offsetWidth)+'px';
    elem.style.top = Math.ceil(Math.random() * -390)+'px';
    elem.speed = Math.ceil(Math.random()*17)+2;
    elem.style.backgroundColor = randomColor();
}

//randomColor
function randomColor(){
    function c(){
        let hex = Math.floor(Math.random()*256).toString(16);
        return ('0'+String(hex)).substr(-2);
    }
    return '#'+c()+c()+c();
}

//presskey on and presskeyoff func.
function pressKeyOn(event){
    event.preventDefault();
    //console.log(keys);
    keys[event.key] = true;
    if(player.speed > 0){
      player.score++;
    }
}
function pressKeyOff(event){
    event.preventDefault();
    //console.log(keys);
    keys[event.key] = false;
}

function startBoard(){
    for(let x = 0; x<13; x++){
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = (x*50)+'px';
        div.style.width = player.roadwidth + 'px';
        container.appendChild(div);
    }
}

//update Dashboard
function updateDashboard(){
    //console.log(player);
    speedDash.innerHTML = Math.round(player.speed * 13);
    lifeDash.innerHTML = player.lives;
    scoreDash.innerHTML = player.score;
    
}

//movingRoad
function moveRoad(){
    //Need to understand offset property in detail and how that code actually work
    let tempRoad = document.querySelectorAll(".road");
    //console.log(tempRoad);
    let previousRoad = tempRoad[0].offsetLeft;
    const pSpeed = player.speed
    for(let x=0; x<tempRoad.length; x++){
        let num = tempRoad[x].offsetTop + pSpeed;
        if(num> 600){
            num = num - 650;
        }
        tempRoad[x].style.top = num + 'px';
    }
    
}

//movingBadGuys

function moveBadGuys(){
    let tempBaddy = document.querySelectorAll('.baddy');
    for(let i=0; i<tempBaddy.length; i++){
        for(let z=0; z<tempBaddy.length; z++){
            if(i !== z && isCollide(tempBaddy[i], tempBaddy[z])){
                tempBaddy[z].style.top = (tempBaddy[z].offsetTop+20)+'px';
                tempBaddy[i].style.top = (tempBaddy[i].offsetTop-20)+'px';
                tempBaddy[z].style.left = (tempBaddy[z].offsetLeft-50)+'px';
                tempBaddy[i].style.left = (tempBaddy[i].offsetLeft+50)+'px';
            }
        }//closing z loop
        let y = tempBaddy[i].offsetTop + player.speed - tempBaddy[i].speed;
        if(y>2000 || y<-2000){
            makeBad(tempBaddy[i]);
        }else{
            tempBaddy[i].style.top = y+'px';
            let hitCar = isCollide(tempBaddy[i],player.ele);
            console.log(hitCar);
            if(hitCar){
                player.speed = 0;
                player.lives--;
                if(player.lives<1){
                    player.gameEndCounter = 1;
                }
                makeBad(tempBaddy[i]);
            }
            
        }
    }//closing i loop
}

//coolision detect
function isCollide(a, b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    //console.log("a car is: ", aRect);
    //console.log("b car is: ", bRect);
    return !(
        (aRect.bottom<bRect.top)||(aRect.top>bRect.bottom)|| (aRect.right<bRect.left)||(aRect.left>bRect.right)
    );
};

function playGame(){
    if(gamePlay){
        //moving car
        moveRoad();
        moveBadGuys();
        //console.log("Game In");
        updateDashboard();
        //Movement
        if(keys.ArrowUp){
            if(player.ele.y > 400)player.ele.y -= 1;
            player.speed = player.speed < 20 ? (player.speed+0.05) : 20;
        }
        if(keys.ArrowDown){
            if(player.ele.y < 510)player.ele.y += 1;
            player.speed = player.speed > 0 ? (player.speed-0.1) : 0;
        }
        if(keys.ArrowRight){
            player.ele.x += (player.speed/4);
        }
        if(keys.ArrowLeft){
            player.ele.x -= (player.speed/4);
        }
        if(player.ele.x > 410){
            gameOver();
        }
        if(player.ele.x < 198){
            gameOver()
        }
        //move car
        player.ele.style.top = player.ele.y+'px';
        player.ele.style.left = player.ele.x+'px';
    }
    gameAnimation = requestAnimationFrame(playGame);
        if(player.gameEndCounter>0){
        player.gameEndCounter--;
        gamePlay = false;
        btnStart.style.display = 'block';
        cancelAnimationFrame(gameAnimation);
    }
    
}

function gameOver(){
    player.speed = 0;
    player.lives = 0;
    updateDashboard();
    gamePlay = false;
    container.innerHTML = "";
    btnStart.style.display = 'block';
    cancelAnimationFrame(gameAnimation);
}
















