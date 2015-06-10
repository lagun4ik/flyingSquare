/*!
 * flying-square
 * 
 * 
 * @author [object Object]
 * @version 1.0.0
 * Copyright 2015.
 */
var Game={Manager:io("localhost:3000"),Map:{},Players:{},PlayersPosition:{},Player:""};Game.Boot={init:function(){this.game.stage.backgroundColor="#e2e2e2",this.input.maxPointers=1,this.stage.disableVisibilityChange=!0},preload:function(){this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.scale.setScreenSize(!0),this.load.image("progressBar","/gfx/progress_bar.png"),Game.Manager.reqMap(game.height)},create:function(){this.physics.startSystem(Phaser.Physics.ARCADE),this.state.start("Preloader")}},Game.Gameover={create:function(){Game.Manager.playerEnd(),this.keySpacebar=this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);var e=this.add.text(this.world.centerX,this.world.centerY,"You "+Game.Players[Game.Player].place,{font:"Squada One",fontSize:96,fill:"#333"});e.angle=(2+5*Math.random())*(Math.random()>.5?1:-1),e.anchor.setTo(.5,.5);var a=this.add.text(this.world.centerX,this.world.centerY+100,"PRESS SPACEBAR TO START MENU",{font:"Squada One",fontSize:35,fill:"#333"});a.angle=(2+5*Math.random())*(Math.random()>.5?1:-1),a.anchor.setTo(.5,.5);var t=this.add.tween(a);t.to({angle:-a.angle},200+200*Math.random(),Phaser.Easing.Linear.None,!0,0,1e3,!0);var i=this.add.emitter(this.world.centerX,this.world.height+20,100);i.makeParticles(this.cache.getBitmapData("square")),i.maxParticleScale=1.2,i.minParticleScale=.2,i.setYSpeed(-100,-100),i.setXSpeed(-30,30),i.gravity=0,i.width=this.world.width,i.minRotation=0,i.maxRotation=45,i.flow(25e3,500),this.keySpacebar.onDown.addOnce(function(){this.state.start("Menu")},this)}},Game.Menu={create:function(){this.music=this.add.audio("menu-music",.5,!0),this.keySpacebar=this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);var e=this.add.text(this.world.centerX,0,"FlyingSquare!",{font:"Squada One",fontSize:100,fill:"#333"});e.anchor.setTo(.5,.5);var a=this.add.tween(e);a.to({y:this.world.centerY-200},1e3).easing(Phaser.Easing.Bounce.Out).start();var t=this.add.text(this.world.centerX,0,"Players:",{font:"Squada One",fontSize:30,fill:"#333"});t.anchor.setTo(.5,.5);var i=this.add.tween(t);i.to({y:this.world.centerY-80},1e3).easing(Phaser.Easing.Bounce.Out).start();var o=this.add.emitter(this.world.centerX,this.world.height+20,100);o.makeParticles(this.cache.getBitmapData("square")),o.maxParticleScale=1.2,o.minParticleScale=.2,o.setYSpeed(-100,-100),o.setXSpeed(-30,30),o.gravity=0,o.width=this.world.width,o.minRotation=0,o.maxRotation=45,o.flow(25e3,500),Game.Menu.countUser=Game.Players.count,Game.Menu.players=this.add.graphics(0,0),Game.Menu.flags={identifier:!0,message:!0},Game.Menu.renderConnectedUsers(),Game.Menu.renderStartMessage(),this.keySpacebar.onDown.addOnce(function(){Game.Manager.playerStart(),this.state.start("Waiting")},this)},update:function(){Game.Menu.countUser!=Game.Players.count&&(Game.Menu.countUser=Game.Players.count,Game.Menu.renderConnectedUsers())},renderConnectedUsers:function(){var e=0,a=0;Game.Menu.players.clear();for(var t in Game.Players)if("count"!=t){var i=Phaser.Color.hexToColor(Game.Players[t].color);i=Phaser.Color.getColor(i.r,i.g,i.b);var o=40;t==Game.Player&&(o=55),Game.Menu.players.beginFill(i,1),a++,e=60*a-150,Game.Menu.players.drawCircle(this.world.centerX+e,this.world.centerY,o),t==Game.Player&&Game.Menu.flags.identifier&&(Game.Menu.flags.identifier=!1,Game.Menu.you=this.add.text(this.world.centerX+e-7,this.world.centerY-15,"Y",{font:"Squada One",fontSize:35,fill:"#FFFFFF"}),Game.Menu.you.angle=(2+5*Math.random())*(Math.random()>.5?1:-1),Game.Menu.youTween=this.add.tween(Game.Menu.you),Game.Menu.youTween.to({angle:-Game.Menu.you.angle},600,Phaser.Easing.Linear.None,!0,0,2e3,!0)),Game.Menu.flags.identifier||t!=Game.Player||(Game.Menu.you.position.x=this.world.centerX+e-7)}},renderStartMessage:function(){var e="PRESS SPACEBAR TO BEGIN";if(0==Game.Player&&(e="ALL SLOTS OCCEPIED"),Game.Menu.flags.message){Game.Menu.flags.message=!1;var a=this.add.text(this.world.centerX,this.world.centerY+100,e,{font:"Squada One",fontSize:40,fill:"#333"});a.angle=(2+5*Math.random())*(Math.random()>.5?1:-1),a.anchor.setTo(.5,.5);var t=this.add.tween(a);t.to({angle:-a.angle},200+200*Math.random(),Phaser.Easing.Linear.None,!0,0,1e3,!0)}}},Game.Play={create:function(){Game.Manager.started(),this.tick=0,this.gameMusic=this.add.audio("background-music",.5,!0),this.explosion=this.add.audio("explosion",1,!1),this.keySpacebar=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),this.hasStarted=!1,this.dead=!1,this.speed=-250,this.speedInterval=200,this.speedGain=-0,this.speedMin=-5e3,this.createBlockSets(),this.createScope(),this.createCopters(),this.startGame()},update:function(){this.hasStarted&&(this.tick%this.speedInterval!==0||this.dead?this.dead&&(this.speed*=.99):this.speed>this.speedMin&&(this.speed+=this.speedGain),this.blockSets.forEach(function(e){e.update()}),this.textScore.setText("SCORE: "+this.tick),this.game.device.localStorage&&this.textBest.setText("BEST: "+Math.max(this.tick,this.bestScore)),this.dead||this.tick++)},updateCopters:function(e){e.id!=Game.Player&&(this.heroes[e.id].position.y=e.pos,console.log(this.heroes[e.id].position.y))},startGame:function(){this.hasStarted||(this.hasStarted=!0,this.gameMusic.play())},createBlockSets:function(){this.blockSets=[],this.blockSets.push(new Game.Blocks(this))},createScope:function(){this.scoreStyle={font:"40px Squada One",fill:"#fff",align:"center"},this.textScore=game.add.text(game.width/2,game.height/2-320,"SCORE: 0",this.scoreStyle),this.textScore.anchor.set(.5,.5),this.game.device.localStorage&&(localStorage.bestScoreCurvy?this.bestScore=localStorage.bestScoreCurvy:(localStorage.bestScoreCurvy=0,this.bestScore=0),this.textBest=game.add.text(game.width/2,game.height/2+340,"BEST: "+this.bestScore,this.scoreStyle),this.textBest.anchor.set(.5,.5))},createCopters:function(){var e={};this.heroes={};for(var a in Game.Players)"count"!=a&&(e[a]=this.add.bitmapData(32,32),e[a].context.fillStyle=Game.Players[a].color,e[a].context.fillRect(0,0,32,32),this.cache.addBitmapData(a,e[a]),this.heroes[a]=new Copter(this,a))},gameOver:function(e){this.explosion.play(),Game.Player==e&&(this.dead=!0,this.gameMusic.stop(),this.tick>this.bestScore&&(localStorage.bestScoreCurvy=this.tick),game.time.events.add(Phaser.Timer.SECOND,function(){game.state.start("Gameover")},self))}},Game.Preloader={preload:function(){var e=this.add.text(this.world.centerX,this.world.centerY,"LOADING...",{font:"Squada One",fontSize:200,fill:"#333"});e.anchor.setTo(.5,.5),this.load.audio("menu-music",["/audio/menu.mp3","/audio/menu.ogg"]),this.load.audio("background-music",["/audio/background.mp3","/audio/background.ogg"]),this.load.audio("explosion",["/audio/explosion.mp3","/audio/explosion.ogg"]);var a=this.add.bitmapData(20,20);a.context.fillStyle="#333",a.context.fillRect(0,0,20,20),this.cache.addBitmapData("square",a);var t=this.add.bitmapData(1,1);t.context.fillStyle="#444",t.context.fillRect(0,0,1,1),this.cache.addBitmapData("block",t)},create:function(){this.time.events.add(.5*Phaser.Timer.SECOND,function(){this.state.start("Menu")},this)},update:function(){}},Game.Waiting={create:function(){var e=this.add.text(this.world.centerX,this.world.centerY,"Waiting for start of players",{font:"Squada One",fontSize:66,fill:"#333"});e.angle=(2+5*Math.random())*(Math.random()>.5?1:-1),e.anchor.setTo(.5,.5);var a=this.add.tween(e);a.to({angle:-e.angle},100+500*Math.random(),Phaser.Easing.Linear.None,!0,0,1e3,!0);var t=this.add.emitter(this.world.centerX,this.world.height+20,100);t.makeParticles(this.cache.getBitmapData("square")),t.maxParticleScale=1.2,t.minParticleScale=.2,t.setYSpeed(-100,-100),t.setXSpeed(-30,30),t.gravity=0,t.width=this.world.width,t.minRotation=0,t.maxRotation=45,t.flow(25e3,500)}},Game.Blocks=function(e){Game.Blocks.state=e,Game.Blocks.blockGroup=game.add.group(),Game.Blocks.blockGroup.enableBody=!0,Game.Blocks.blockGroup.createMultiple(300,game.cache.getBitmapData("block")),Game.Blocks.tick=0,Game.Blocks.blockSize=20,Game.Blocks.tracer=Game.Map.shift(),this.fillScreen(0,!0),console.log(Game.Blocks)},Game.Blocks.prototype.update=function(){var e=100,a=0;Game.Blocks.blockGroup.forEachAlive(function(t){Game.Blocks.state.hasStarted&&(t.body.velocity.x=Game.Blocks.state.speed),e=Math.min(e,t.body.x+Game.Blocks.blockSize),a=Math.max(a,t.body.x+Game.Blocks.blockSize)}),Game.Blocks.blockGroup.forEachAlive(function(e){e.x+e.body.width<0&&e.kill()}),this.fillScreen(a,!1)},Game.Blocks.prototype.fillScreen=function(e,a){if(a||Game.Blocks.state.hasStarted)for(;e<game.width+Game.Blocks.blockSize-Game.Blocks.state.speed;){Game.Blocks.tracer=Game.Map.shift(),Game.Blocks.tick++;var t,i,o,r;t=0,i=Game.Blocks.tracer.y,o=i+Game.Blocks.tracer.h,r=game.height-o,newBlockTop=this.createOne(e,t,Game.Blocks.blockSize,i),newBlockBot=this.createOne(e,o,Game.Blocks.blockSize,r),a||(newBlockTop.body.velocity.x=Game.Blocks.state.speed,newBlockBot.body.velocity.x=Game.Blocks.state.speed),e+=Game.Blocks.blockSize}},Game.Blocks.prototype.createOne=function(e,a,t,i){if(Game.Blocks.blockGroup.countDead())var o=Game.Blocks.blockGroup.getFirstDead();else var o=Game.Blocks.blockGroup.create(e,a,game.cache.getBitmapData("block"));return o.reset(e,a),o.body.allowGravity=!1,o.body.immovable=!0,o.scale.x=t+10,o.scale.y=i+10,o},Copter=function(e,a){Phaser.Sprite.call(this,game,200,game.height/2,game.cache.getBitmapData(a)),Game.Player==a&&(game.physics.arcade.enableBody(this),this.body.allowGravity=!0,this.body.width=32,this.body.height=32,this.body.gravity.y=2),this.anchor.setTo(.5,.5),this.state=e,this.player=a,this.createEmitter(this),game.add.existing(this)},Copter.prototype=Object.create(Phaser.Sprite.prototype),Copter.prototype.update=function(){this.player==Game.Player&&this.state.hasStarted&&!this.state.dead&&(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)&&(this.body.velocity.y-=1),this.body.velocity.y<=-300&&(this.body.velocity.y=-300),this.angle=this.body.velocity.y/6-10,Game.Players[Game.Player].position=this.body.y,Game.Players[Game.Player].angle=this.angle),game.physics.arcade.collide(this,Game.Blocks.blockGroup,this.die)},Copter.prototype.createEmitter=function(e){e.emitterDark=game.add.emitter(0,0,20),e.emitterDark.makeParticles(game.cache.getBitmapData("square")),e.emitterDark.minParticleScale=.1,e.emitterDark.maxParticleScale=.5,e.emitterDark.setYSpeed(-15,15),e.emitterDark.setXSpeed(-15,15),e.emitterDark.gravity=-10},Copter.prototype.emit=function(e){e.emitterDark.x=e.x,e.emitterDark.y=e.y,e.emitterDark.start(!0,2e3,null,100),e.emitterDark.forEachAlive(function(a){a.body.velocity.x+=e.state.speed/2}),e.alpha=0},Copter.prototype.die=function(e){e.emit(e),e.state.gameOver(e.player)},Game.Manager.on("playerConnected",function(e){Game.Player=e}),Game.Manager.on("getAllPlayers",function(e){Game.Players=e}),Game.Manager.on("start",function(){game.state.start("Play")}),Game.Manager.playerStart=function(){Game.Manager.emit("playerStart",Game.Player)},Game.Manager.started=function(){Game.Manager.emit("started",Game.Player)},Game.Manager.on("getCondition",function(){Game.Play.dead||Game.Players[Game.Player].position&&Game.Players[Game.Player].angle&&Game.Manager.emit("condition",{id:Game.Player,pos:Game.Players[Game.Player].position,angle:Game.Players[Game.Player].angle})}),Game.Manager.on("condition",function(e){Game.Play.dead||Game.Play.updateCopters(e)}),Game.Manager.playerEnd=function(){Game.Manager.emit("playerEnd",Game.Player)},Game.Manager.sendingDead=function(){Game.Manager.emit("sendingDead",Game.Player)},Game.Manager.reqMap=function(e){Game.Manager.emit("getMap",e)},Game.Manager.on("getMap",function(e){Game.Map=e});var innerWidth=window.innerWidth,innerHeight=window.innerHeight,gameRatio=innerWidth/innerHeight,game=new Phaser.Game(Math.ceil(800*gameRatio),800,Phaser.WebGL,"gameContainer");game.global={},game.state.add("Boot",Game.Boot),game.state.add("Preloader",Game.Preloader),game.state.add("Menu",Game.Menu),game.state.add("Waiting",Game.Waiting),game.state.add("Play",Game.Play),game.state.add("Gameover",Game.Gameover),game.state.start("Boot");
//# sourceMappingURL=app.js.map