let teacher = document.getElementById('teacher');
let gameArea = document.getElementById('gameArea');
let scoreDisplay = document.getElementById('score');

let teacherPositionX = 50; // Opettajan lähtöpaikka vaakasuunnassa
let teacherPositionY = 400; // Opettajan lähtöpaikka pystysuunnassa
let teacherJumping = false;
let teacherVelocityY = 0;
let gravity = 0.5;
let jumpStrength = -10;

let score = 0;
let gameSpeed = 60; // Pelinopeus (fps)
let enemySpeed = 3;
let enemies = [];

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && teacherPositionX > 0) {
        teacherPositionX -= 10;
    } else if (event.key === 'ArrowRight' && teacherPositionX < 260) {
        teacherPositionX += 10;
    } else if (event.key === ' ' && !teacherJumping) { // Välilyönti hypyn aloittamiseksi
        teacherJumping = true;
        teacherVelocityY = jumpStrength;
    }
    teacher.style.left = teacherPositionX + 'px';
});

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = '300px'; // Vihollinen alkaa pelialueen oikealta laidalta
    enemy.style.top = '400px'; // Vihollinen on maan tasalla
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        let enemyLeft = parseInt(enemy.style.left);
        enemyLeft -= enemySpeed; // Vihollinen liikkuu vasemmalle

        if (enemyLeft < -40) { // Jos vihollinen menee pelialueen ulkopuolelle
            gameArea.removeChild(enemy);
            enemies.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
            if (score % 5 === 0) {
                enemySpeed++; // Lisää vihollisten nopeutta joka viides piste
            }
        } else {
            enemy.style.left = enemyLeft + 'px'; // Päivitetään vihollisen sijainti
        }
    });
}

function updateTeacher() {
    if (teacherJumping) {
        teacherVelocityY += gravity; // Sovelletaan painovoimaa hyppäävään opettajaan
        teacherPositionY += teacherVelocityY;
        if (teacherPositionY >= 400) { // Tarkistetaan, onko opettaja maan tasalla
            teacherPositionY = 400;
            teacherJumping = false;
            teacherVelocityY = 0;
        }
        teacher.style.top = teacherPositionY + 'px';
    }
}

function checkCollision() {
    enemies.forEach(enemy => {
        let enemyRect = enemy.getBoundingClientRect();
        let teacherRect = teacher.getBoundingClientRect();
        if (!(teacherRect.right < enemyRect.left || 
              teacherRect.left > enemyRect.right || 
              teacherRect.bottom < enemyRect.top || 
              teacherRect.top > enemyRect.bottom)) {
            alert('Peli päättyi! Pisteesi: ' + score);
            window.location.reload();
        }
    });
}

function gameLoop() {
    moveEnemies();
    updateTeacher();
    checkCollision();
    setTimeout(gameLoop, 1000 / gameSpeed);
}

setInterval(createEnemy, 1500); // Luo uusi vihollinen joka 1,5 sekunti
gameLoop();
