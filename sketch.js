var buzz,buzz_img,buzz_crouch,buzz_lose;
var bordas;
var chao,chao_img;
var invchao;
var cloud,cloud_img;
var spike;
var points=0;
var cloudg,spikeg;
var START=1;
var END=0;
var state = START;
var fim,fim_img;
var restart,restart_img;
var bird,bird_img;
var dies,checkpoints,jumps;

function preload(){
  //pre carrega os arquivos do jogo
  
  buzz_img = loadAnimation("trex1.png","trex3.png","trex4.png");
  chao_img = loadImage("ground2.png");
  cloud_img = loadImage("cloud.png");
  buzz_crouch = loadAnimation("trex_low1.png","trex_low2.png");
  buzz_lose = loadImage("trex_collided.png");
  
  spike1=loadImage("obstacle1.png");
  spike2=loadImage("obstacle2.png");
  spike3=loadImage("obstacle3.png");
  spike4=loadImage("obstacle4.png");
  spike5=loadImage("obstacle5.png");
  spike6=loadImage("obstacle6.png");
  
  fim_img=loadImage("gameOver.png");
  
  restart_img=loadImage("restart.png");
  
  bird_img=loadAnimation("bird1.png","bird1.png","bird2.png","bird2.png");
  
  dies=loadSound("die.mp3");
  checkpoints=loadSound("checkPoint.mp3");
  jumps=loadSound("jump.mp3");
}

function setup(){
  //funcao de configuração
  
 createCanvas(600,200);
  
  //configuração do buzz
  buzz = createSprite(50,150,20,20);
  buzz.addAnimation("running",buzz_img);
  buzz.addAnimation("crouching",buzz_crouch);
  buzz.addAnimation("lose",buzz_lose);
  buzz.scale = 0.5;
  
  
  bordas = createEdgeSprites();
 
  chao = createSprite(300,190,600,20);
  chao.addImage(chao_img);
  chao.x=chao.width/2;

  invchao = createSprite(300,195,600,18);
  invchao.visible=false;

  //var rand = Math.round(random(1,10));
  //console.log(rand);

  cloudg=new Group();
  spikeg=new Group();
  birdg=new Group();
  
  //buzz.debug=true;
  buzz.setCollider("circle",0,0,30);
  
  fim=createSprite(300,100,60,60);
  fim.addImage(fim_img);
  fim.scale=0.6
  fim.visible=false;
  
  restart=createSprite(300,140,60,60);
  restart.addImage(restart_img);
  restart.scale=0.8
  restart.visible=false;


}

function draw(){
  background("white");
  
  textSize(18);
  text("Points: "+points,450,20);

  
  //buzz.collide(bordas[3]);
  buzz.collide(invchao);
  
  if(state===START){
   points=points+Math.round(frameRate()/60);
  
   if(points%100===0&&points>0){
     checkpoints.play();
   }
    
   //pulo do buzz
   if(keyDown("space")&&buzz.isTouching(chao)){
    buzz.velocityY = -12;
    jumps.play();
   }
   clouds();
   cactus();
   birds();
   
   if(keyDown("down")&&buzz.isTouching(chao)){
    buzz.changeAnimation("crouching");  
   }
   else{
    buzz.changeAnimation("running");
   }
  
   //gravidade
   buzz.velocityY = buzz.velocityY + 0.8;
  
   chao.velocityX=-(5+points/100);
  
   if(chao.x<0){
    
    chao.x=chao.width/2;
   }
  
   if(buzz.isTouching(spikeg)||buzz.isTouching(birdg)){
     state=END;
     dies.play();
   }
  }
  else if(state===END){
   chao.velocityX=0;
   cloudg.setVelocityXEach(0);
   spikeg.setVelocityXEach(0);
   birdg.setVelocityXEach(0);
   buzz.changeAnimation("lose");
   buzz.velocityY=0;
   cloudg.setLifetimeEach(-1);
   spikeg.setLifetimeEach(-1);
   birdg.setLifetimeEach(-1);
   fim.visible=true;
   restart.visible=true;
   if(mousePressedOver(restart)){
     reset();
   }
  }
  
  drawSprites();
}
function clouds(){
  if(frameCount%80===0){
   cloud=createSprite(630,50,30,30);
   cloud.velocityX=-(2+points/100);
   cloud.addImage(cloud_img);
   cloud.scale = (random(0.5,0.8));
   cloud.y=Math.round(random(20,100));
   cloud.depth=buzz.depth;
   buzz.depth=buzz.depth+1;
   cloud.lifetime=330;
   
   cloudg.add(cloud);
    
  }
}
function cactus(){
  if(frameCount%65===0){
    spike=createSprite(620,175,20,20);
    spike.velocityX=-(5+points/100);
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:spike.addImage(spike1); 
      break;
      case 2:spike.addImage(spike2);
      break;
      case 3: spike.addImage(spike3);
      break;
      case 4:spike.addImage(spike4);
      break;
      case 5:spike.addImage(spike5);
      break;
      case 6:spike.addImage(spike6);
      break;
      default:break;
    }
    
    spike.scale=0.5;
    spike.lifetime=130;
    
    spikeg.add(spike);
    
    spike.depth=buzz.depth;
    buzz.depth=buzz.depth+1;
  }
}
function birds(){
  if(frameCount%500===0){
    bird=createSprite(620,100,50,50);
    bird.velocityX=-(5+points/100);
    bird.addAnimation("bird",bird_img);
    bird.lifetime=130;
    
    birdg.add(bird);
  }
}
function reset(){
  state=START;
  spikeg.destroyEach();
  cloudg.destroyEach();
  birdg.destroyEach();
  points=0;
  
  restart.visible=false;
  fim.visible=false;
  
}
