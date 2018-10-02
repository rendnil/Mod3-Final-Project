document.addEventListener("DOMContentLoaded", ()=>{


alert("Start Game")


  const canvas = document.getElementById('canvas')
  const canvas2 = document.getElementById("canvas2")
  const ctx2 = canvas2.getContext("2d")
  const ctx = canvas.getContext('2d')

  const coinImage = document.getElementById("coin-img")
  const rockImage = document.getElementById("y-img")



  //ship specs
  let shipX = canvas.width/2
  let shipY = canvas.height * (0.9)
  let xFromCenter = 12.5
  let yUpFromCenter = 25
  let yDownFromCenter = 15

  let shipDx = 5
  let shipDy = 5

  //bullet specs
  let bulletArray = [ ]
  let bulletRadius = 3
  let bulletDy = 5
  let bulletDelay = 5

  //rock specs

  let rockArray = []
  let rockRadius = 10
  let rockDy = 2
  let rockDelay = 120

  //score
  let hitCounter = 0


  let timer = 0

  let rightPressed = false
  let leftPressed = false
  let downPressed = false
  let upPressed = false
  let spacePressed = false

  //sprite rendering
  function renderCoin(){
    let portion = timer % 10
    ctx.drawImage(coinImage, portion * (coinImage.width/10),0, 46, coinImage.height, canvas.width/2, canvas.height/2, coinImage.width/10, coinImage.height)
  }


  function rand(){
    return Math.random()
  }

  function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+hitCounter, 8, 20);
  }


  function drawShip(){
    ctx.beginPath()
    ctx.moveTo(shipX, shipY-yUpFromCenter)
    ctx.lineTo(shipX - xFromCenter, shipY+yDownFromCenter)
    ctx.lineTo(shipX + xFromCenter, shipY + yDownFromCenter)
    ctx.fillStyle = "rgba(255, 255, 255, 1)"
    ctx.fill()
    ctx.closePath()

  }

  function drawInitialBullet(){

    let newBullet = {x: shipX, y: (shipY-yUpFromCenter), visible: true}
    ctx.beginPath()
    ctx.arc(shipX, shipY - yUpFromCenter, bulletRadius, 0, Math.PI*2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()
    bulletArray.push(newBullet)

  }

  function drawBullets(){
    bulletArray.forEach((b, index)=>{

      if (b.visible){
      ctx.beginPath()
      ctx.arc(b.x, b.y, bulletRadius, 0, Math.PI*2)
      ctx.fillStyle = "red"
      ctx.fill()
      ctx.closePath()


      //animate
      b.y -= bulletDy
    }
      //delete bullet from array if it goes off the screen
      if (b.y < 0 || b.visible === false){
        bulletArray.splice(index,1)
      }

    })
  }

  function drawInitialRock(){
      //need to refactor this
    let newRock = {x: rand()*(canvas.width), y: (rand()*canvas.height)*0.25, dx:(rand()*3), dy:(rand()*3), radius:(rand()*rockRadius)+15,  visible: true}

    ctx.beginPath()
    ctx.arc(newRock.x, newRock.y, newRock.radius, 0, Math.PI*2)
    ctx.fillStyle = "green"
    ctx.fill()
    ctx.closePath()

    rockArray.push(newRock)
  }

  function drawRocks(){
    rockArray.forEach((r, index)=>{
      if (r.visible){
      ctx.beginPath()
      if (hitCounter > 1){
      ctx.drawImage(rockImage, r.x-r.radius, r.y-r.radius, r.radius*2, r.radius*2)
    }else{

      ctx.arc(r.x, r.y, r.radius, 0, Math.PI*2)
      ctx.fillStyle = "green"
      ctx.fill()
    }
      ctx.closePath()


      //check for screen collision
      //x axis collision
      if ((r.x <r.radius) || ((r.x + r.radius) > canvas.width)){
        r.dx = -r.dx
      }


      //animate
      r.y += r.dy
      r.x += r.dx
    }
      //delete rock from array if it goes off the screen
      if ((r.y > canvas.height)||r.visible == false){
        rockArray.splice(index,1)
      }

    })

  }


  function checkBulletCollision(){
    bulletArray.forEach((bullet)=>{
      rockArray.forEach((rock)=>{
        if((bullet.x>(rock.x- rock.radius))&&(bullet.x< (rock.x + rock.radius))&&(bullet.y>(rock.y-rock.radius))&&(bullet.y<(rock.y+rock.radius))){
          rock.visible = false
          bullet.visible = false
          hitCounter++
        }
      })
    })
  }


  function generateStar(canvas, ctx, starRadius){
			ctx.beginPath();
			ctx.arc(starRadius + (Math.random() * canvas.width), starRadius + (Math.random() * canvas.height), starRadius*Math.random(), 0, Math.PI*2, false);
      //ctx.arc(100, 30, starRadius, 0, Math.PI*2, false);

      let rand = Math.random();
      if(rand <= 0.5){
				  ctx.fillStyle = "rgba(255, 255, 255, 1)";
				  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
				  ctx.shadowBlur = 3;
			}
			else if(rand > 0.75){
				  ctx.fillStyle = "rgba(255, 254, 196, 1)";
				  ctx.shadowColor = "rgba(255, 254, 196, 0.5)";
				  ctx.shadowBlur = 4;
			}
			else{
				  ctx.fillStyle = "rgba(192, 247, 255, 1)";
				  ctx.shadowColor = "rgba(192, 247, 255, 0.5)";
				  ctx.shadowBlur = 7;
			}
			ctx.fill();
	}

  function drawBackground(){

    if (timer < 90){
      generateStar(canvas2, ctx2, 5)
      requestAnimationFrame(drawBackground)

    }
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //ctx.drawImage(image, 0,0, canvas.width, canvas.height)
    drawShip()
    drawScore()


    //renderCoin()






    //right movement
    if (rightPressed && ((shipX+xFromCenter) < canvas.width)){
      shipX +=shipDx
    }

    //left movement
    if (leftPressed && (shipX>xFromCenter)){
      shipX -=shipDx
    }

    //up movement
    if (upPressed && (shipY>yUpFromCenter)){
      shipY -= shipDy
    }

    //down movement
    if (downPressed && ((shipY+yDownFromCenter)<canvas.height)){
      shipY += shipDy
    }

    //shoot
    if (spacePressed && timer %bulletDelay===0){
      drawInitialBullet()
    }

    //loop over the bullets and draw them
    drawBullets()
    checkBulletCollision()



    timer++

    // if (timer % 2 ==0){
    //

    // }


    // now we deploy a rock
    if (timer %rockDelay===0){
      drawInitialRock()
    }
    drawRocks()


    requestAnimationFrame(draw)
  }//end draw



  function keyDownHandler(e) {
  //right
    if(e.keyCode == 68) {
    rightPressed = true;
    //left
  }else if(e.keyCode == 65) {
    leftPressed = true;
    //up
  }else if (e.keyCode == 87){
      upPressed = true;
    //down
  }else if (e.keyCode == 83){
      downPressed = true;
    //space bar
  }else if (e.keyCode == 74){
      spacePressed = true

    }
  }

  function keyUpHandler(e) {
    //right
    if(e.keyCode == 68) {
      rightPressed = false;
      //left
    }else if(e.keyCode == 65) {
      leftPressed = false;
      //up
    }else if (e.keyCode == 87){
        upPressed = false;
      //down
    }else if (e.keyCode == 83){
        downPressed = false;

    //j pressed for shoot
  }else if (e.keyCode == 74){
      spacePressed = false

    }
  }



  document.addEventListener("keydown", keyDownHandler, false)
  document.addEventListener("keyup", keyUpHandler, false)

  draw()
  drawBackground()




  })