const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink,eat,sad;

//Variables para los sonidos  



function preload(){
  bg_img = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  //Precargar sonidos 
  

  //Habilitamos las animaciones 
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  //evitamos que la animación se resprodusca una y otra vez 
  sad.looping= false;
  eat.looping = false; 
  }

function setup() {
  createCanvas(500,700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  //Botón para cortar la cuerda
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //Guardar molde de cuerda en variable 
  rope = new Rope(7,{x:245,y:30});
  //Guardar molde del suelo en variable 
  ground = new Ground(200,690,600,20);

  //Configuramos la velocidad de la animación. 
  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  //Crear objeto del conejito
  bunny = createSprite(130,620,100,100);
  bunny.scale = 0.2;

  //Agregar animación a nuestro Sprite con etiqueta
  bunny.addAnimation('blinking',blink);
  
  //Cambiar animación
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  //Creamos cuerpo circular para la fruta 
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  //Guardar molde de restricción en variable 
  fruit_con = new Link(rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,490,690);

  //Solo queremos mostrar la fruta si su cuerpo existe
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  //Mostrar la cuerda
  rope.display();
  Engine.update(engine);
  //Mostar suelo
  ground.display();
  

  //Condición para detectar colisión de la fruta
  if(collide(fruit,bunny)==true){
    //Si colisiona con el conejo cambia de animación
    bunny.changeAnimation('eating');
    
  }
  //Condición para detectar colisión 
  if(collide(fruit,ground.body)==true){
    //Si colisiona con el suelo cambia de animación 
     bunny.changeAnimation('crying');
     
   }

  drawSprites();
}

//Función que corta la fruta
function drop(){
  
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

//Función para detectar la colisión
function collide(body,sprite){
  //Condición para verificar si el cuerpo (fruta) existe o no
  if(body!=null){ 
    //Comprobar la distancia entre la fruta y el conejito usando la posicion de cada uno
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
      //Condición que comprueba la distancia  
      if(d<=80){
          //Removeremos la fruta del mundo
          World.remove(engine.world,fruit);
          //Anulamos la fruta 
          fruit = null;
          //Regresamos al inicio para comprobar otra fruta 
          return true; 
        }
        //Si no se cumple la colisión
        else{
          //Regresaremos a un valor falso 
          return false;
        }
  }
}



