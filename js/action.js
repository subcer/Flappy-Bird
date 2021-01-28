console.clear()

//設定一個 函式來接收  size,position,rotate,selector  為一個通用模組
var GameObject = function(size,position,rotate,selector){
  this.selector = selector
  this.$el = $(selector)
  this.size = size
  this.position = position
  this.rotate = rotate
  this.$el.css("position","absolute")
  this.updateCss()
}
//設定updateCss 在 GameObject函式 作為更新  CSS 動作
GameObject.prototype.updateCss = function(){
  this.$el.css("width",this.size.width)
  this.$el.css("height",this.size.height)
  this.$el.css("top",this.position.y)
  this.$el.css("left",this.position.x)
  this.$el.css("transform","rotate("+this.rotate+"deg)")
}
//設定碰撞
GameObject.prototype.collide = function(otherObject){
  var paddingXY = 1 //設定一個數字 把判斷範圍往內縮
  //x 位置碰撞判斷
  var inRangeX = (otherObject.position.x+paddingXY > this.position.x && otherObject.position.x+paddingXY < this.position.x + this.size.width) || (otherObject.position.x + otherObject.size.width-paddingXY > this.position.x && otherObject.position.x + otherObject.size.width-paddingXY < this.position.x + this.size.width)
  //y 位置碰撞判斷
  var inRangeY = (otherObject.position.y+paddingXY > this.position.y && otherObject.position.y+paddingXY < this.position.y + this.size.height) || (otherObject.position.y + otherObject.size.height -paddingXY > this.position.y && otherObject.position.y + otherObject.size.height-paddingXY  < this.position.y + this.size.height)
  return inRangeX && inRangeY
}

//鳥
var Bird = function(){
  this.size = { width: 40, height: 28 }
  this.position = {x: 30,y: 225}
  this.rotate = 0 
  GameObject.call(this,this.size,this.position,this.rotate,".bird")
}
Bird.prototype = Object.create(GameObject.prototype)
Bird.prototype.constructor = Bird.constructor
//設定鳥 到最頂端 跟 底端的判斷
Bird.prototype.update = function(){
  if(this.position.y < 0){
    this.position.y = 0
  }
  if(this.position.y > 450){
    this.position.y = 450
  }
  this.updateCss()
}
var bird = new Bird()

var tubeHeight = 0 //初始化 tubeHeight
//下方管子
var TubeBottom = function(position,rotate,selector){
  tubeHeight = Math.floor(Math.random()*5)
  //console.log(tubeHeight+"Bottom")
  this.size = {
    width: 60,
    height: tubeHeight*100
  }
  console.log(this.size.height+"TubeBottom")
  this.position = {
    x: position.x,
    y: 500-this.size.height
  }  
  GameObject.call(this,this.size,this.position,rotate,selector)
}
TubeBottom.prototype = Object.create(GameObject.prototype)
TubeBottom.prototype.constructor = TubeBottom.constructor
//更新判斷 超過螢幕後 重新生成一個新的 管子
TubeBottom.prototype.update = function(){
  if(this.position.x <= -60){    
    this.position.x = 660
    
    if(this.selector == ".tube1"){
      tube1 = new TubeBottom({x:this.position.x},0,this.selector)
    }
    else if(this.selector == ".tube3"){
      tube3 = new TubeBottom({x:this.position.x},0,this.selector)
    }
    else if(this.selector == ".tube5"){
      tube5 = new TubeBottom({x:this.position.x},0,this.selector)
    }
  }
  this.updateCss()
}
//上方管子
var TubeTop = function(position,rotate,selector){  
  //console.log(tubeHeight+"")
  this.size = {
    width: 60,
    height: (4-tubeHeight)*100
  }
  console.log(this.size.height+"TubeTop")
  this.position = {
    x: position.x,
    y: 0
  }
  
  GameObject.call(this,this.size,this.position,rotate,selector)  
}
TubeTop.prototype = Object.create(GameObject.prototype)
TubeTop.prototype.constructor = TubeTop.constructor
//更新判斷 超過螢幕後 重新生成一個新的 管子
TubeTop.prototype.update = function(){
  if(this.position.x <= -60){
    this.position.x = 660 
    
    if(this.selector == ".tube2"){
      tube2 = new TubeTop({x:this.position.x},180,this.selector)
    }
    else if(this.selector == ".tube4"){
      tube4 = new TubeTop({x:this.position.x},180,this.selector)
    }
    else if(this.selector == ".tube6"){
      tube6 = new TubeTop({x:this.position.x},180,this.selector)
    }
  }
  this.updateCss()
}

//遊戲開始 控制 主體
var Game = function(){
  this.grade = 0 //成績
  this.gNumber = 1 //成績加速門檻
  this.addSpeed = 0 //加速
  this.gradeOpen = false
  this.keyboard()  
  this.control = {}
  //this.startGame()
}
//鍵盤控制功能
Game.prototype.keyboard = function(){
  let _this = this// 在keydown 裡面的 function  this會指向 自己的function 所以要在設定一個_this 來指定 Game 的this
  $(window).keydown(function(evt){    
    _this.control[evt.key] = true
    console.log(_this.control)
  })
  $(window).keyup(function(evt){    
    _this.control[evt.key] = false
    console.log(_this.control)
  })
}
//遊戲開始 按鈕 及 倒數
Game.prototype.startGame = function(){
  let _this = this// 在gameStart 裡面的 function  this會指向 自己的function 所以要在設定一個_this 來指定 Game 的this
  var time = 3
  var grade = 0
  
  
  var gameStart = setInterval(function(){    
    $(".infoText").text(time)
    time -= 1
    if(time < 0){
      tube1 = new TubeBottom({x: 180},0,".tube1")
      tube2 = new TubeTop({x: 180},180,".tube2")
      tube3 = new TubeBottom({x: 420},0,".tube3")
      tube4 = new TubeTop({x: 420},180,".tube4")
      tube5 = new TubeBottom({x: 660},0,".tube5")
      tube6 = new TubeTop({x: 660},180,".tube6")
      _this.startGameMain()     
      clearInterval(gameStart)
      $(".info").css("display","none")
      $(".infoText").css("display","none")
      $(".info .start").css("display","none")
    }
  },1000) 
}
//重新開始
Game.prototype.restartGame = function(){
  let _this = this// 在gameStart 裡面的 function  this會指向 自己的function 所以要在設定一個_this 來指定 Game 的this
  var time = 3
  var grade = 0
  
  
  var gameStart = setInterval(function(){
    $(".infoText").css("display","block")
    $(".info .start").css("display","block")
    $(".info .grade").css("display","none")
    $(".infoText").text(time)
    time -= 1
    if(time < 0){
      tube1 = new TubeBottom({x: 180},0,".tube1")
      tube2 = new TubeTop({x: 180},180,".tube2")
      tube3 = new TubeBottom({x: 420},0,".tube3")
      tube4 = new TubeTop({x: 420},180,".tube4")
      tube5 = new TubeBottom({x: 660},0,".tube5")
      tube6 = new TubeTop({x: 660},180,".tube6")
      _this.startGameMain()     
      clearInterval(gameStart)
      $(".grade h3").text(grade)
      $(".info").css("display","none")
      $(".infoText").css("display","none")
      $(".info .start").css("display","none")
    }
  },1000) 
}
Game.prototype.startGameMain = function(){
  let _this = this// 在gameTime 裡面的 function  this會指向 自己的function 所以要在設定一個_this 來指定 Game 的this
  var gameTime = setInterval(function(){
    if(_this.grade != null){
      
      if(_this.grade == (10*_this.gNumber)){
        _this.addSpeed++
        _this.gNumber++
      }
      tube1.position.x -= 1+_this.addSpeed
      tube2.position.x -= 1+_this.addSpeed
      tube3.position.x -= 1+_this.addSpeed
      tube4.position.x -= 1+_this.addSpeed
      tube5.position.x -= 1+_this.addSpeed
      tube6.position.x -= 1+_this.addSpeed
    }     
    
    //計算成績
    if(bird.position.x == tube1.position.x){
      _this.grade += 1
      $(".grade h3").text(_this.grade)       
    }   
    if(bird.position.x == tube3.position.x){
      _this.grade += 1
      $(".grade h3").text(_this.grade)
    }
    if(bird.position.x == tube5.position.x){
      _this.grade += 1
      $(".grade h3").text(_this.grade)
    }    
    
    //鳥與管子碰撞 
    if(tube1.collide(bird)){
      console.log("hit a tube1")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")
    }
    else if(tube2.collide(bird)){
      console.log("hit a tube2")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")
      
    }
    else if(tube3.collide(bird)){
      console.log("hit a tube3")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")  
    }
    else if(tube4.collide(bird)){
      console.log("hit a tube4")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")        
    }
    else if(tube5.collide(bird)){
      console.log("hit a tube5")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")   
    }
    else if(tube6.collide(bird)){
      console.log("hit a tube6")
      clearInterval(gameTime)
      $(".info").css("display","flex")
      $(".info .restart").css("display","block")
      $(".info .grade").css("display","flex")    
    }
    
    //按鍵向上功能及自動向下
    if(_this.control["ArrowUp"]){
      bird.position.y -= 6
      bird.rotate = -30
      //console.log(bird.position.y)
    }
    else if(_this.control[" "]){
      bird.position.y -= 6
      bird.rotate = -30
    }
    else{
      bird.position.y += 6
      bird.rotate = 30
      //console.log(bird.position.y)      
    }
    
    //更新css 
    bird.update()
    tube1.update()
    tube2.update()
    tube3.update()
    tube4.update()
    tube5.update()
    tube6.update()

  },30) 
}

var game = new Game()