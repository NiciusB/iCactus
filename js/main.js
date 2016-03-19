var cactus;
$(function() {
  cactus = new Cactus();
  var maxcactusid=3, maxflowerpotsid=3;
  cactus.load();
  cactus.computeUpdate();
  
  $('#welcome .next, #welcome .previous').click(function(){
      var ischangingcactus=$(this).parent().is($('#welcomecactus'));
      var thisid=parseInt($(this).parent().find('.preview').attr('data-id'))+1;
      if((ischangingcactus && thisid>maxcactusid) || (!ischangingcactus && thisid>maxflowerpotsid)) thisid=1;
      $(this).parent().find('.preview').attr('data-id', thisid);
      if(ischangingcactus)
      $(this).parent().find('.preview').css('background-image', 'url(img/cactus/'+thisid+'.png)');
      else
      $(this).parent().find('.preview').css('background-image', 'url(img/flowerpots/'+thisid+'.png)');
  });
  $('#welcome .done').click(function(){
      var ischangingcactus=$(this).parent().parent().is($('#welcomecactus'));
      var thisid=parseInt($(this).parent().parent().find('.preview').attr('data-id'));
      if(ischangingcactus) cactus.cactus=thisid; else cactus.flowerpot=thisid;
      cactus.updateUI();
  });
  $('#view>div').click(function(){
      cactus.humidity+=25;
      cactus.computeUpdate();
      $('#thoughts').html(cactus.getRandomWateringThought());
  });
  setInterval("cactus.computeUpdate()", 30000);
});
var Cactus=function() {this.initialize()};
Cactus.prototype.initialize=function() {
      this.alive= false;
      this.cactus= -1;
      this.flowerpot= -1;
};
Cactus.prototype.computeUpdate=function() {
  var delta=Math.floor(new Date()/1000)-this.lastupdated;
  Cactus.prototype.updateLastUpdated();
  this.humidity-=delta*25/7/24/60/60;
  if(this.humidity<0) this.kill();
  else if(this.humidity>200) this.kill();
  this.age+=delta/24/60/60;
  this.updateUI();
};
Cactus.prototype.updateUI=function() {
  this.save();
  if(!this.alive) {
    $('#welcome').stop(true, true).fadeIn(500);
    $('#game').stop(true, true).fadeOut(500);
    if(this.cactus==-1) {
      $('#welcome #welcomeflowerpot').stop(true, true).fadeOut(500);
      $('#welcome #welcomecactus').stop(true, true).fadeIn(500);
      $('#welcome #welcomecactus .title').html('Select your cactus!');
      $('#welcome #welcomecactus .preview').css('background-image', 'url(img/cactus/1.png)');
      $('#welcome #welcomecactus .preview').attr('data-id', '1');
    } else if(this.flowerpot==-1) {
      $('#welcome #welcomecactus').stop(true, true).fadeOut(500);
      $('#welcome #welcomeflowerpot').stop(true, true).fadeIn(500);
      $('#welcome #welcomeflowerpot .title').html('Select your flower pot!');
      $('#welcome #welcomeflowerpot .preview').css('background-image', 'url(img/flowerpots/1.png)');
      $('#welcome #welcomeflowerpot .preview').attr('data-id', '1');
    } else {
      this.alive= true;
      this.age= 0;
      this.humidity= 25;
      this.updateLastUpdated();
      this.updateUI();
      $('#thoughts').html('Watering increases the humidity. Don\'t let it dry, but don\'t drown it. Humidity decreases a little bit each day');
    }
  } else {
    $('#welcome').stop(true, true).fadeOut(500);
    $('#game').stop(true, true).fadeIn(500);
    $('#humiditymeter .mark').html(Math.round(this.humidity*100)/100+'%');
    $('#view .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#view .flowerpot').css('background-image', 'url(img/flowerpots/'+this.flowerpot+'.png)');
    $('#age').html(Math.floor(this.age)+' days');
    $('#thoughts').html(cactus.getRandomThought());
  }
};
Cactus.prototype.kill = function() {
  this.initialize();
  this.updateUI();
};
Cactus.prototype.updateLastUpdated = function() {
  this.lastupdated=Math.floor(new Date()/1000);
};
Cactus.prototype.getRandomWateringThought = function() {
  var thoughts=[
  'yay yay yay',
  'yaayyy',
  ':D',
  'hehehe!!!'
  ];
  return thoughts[Math.floor(Math.random()*thoughts.length)];
};
Cactus.prototype.getRandomThought = function() {
  var thoughts=[
  'I liek trains',
  'BIG THINGS',
  'Thug life yo'
  ];
  return thoughts[Math.floor(Math.random()*thoughts.length)];
};
Cactus.prototype.getAsData = function() {
  var retarr={};
  for(key in this) if(typeof this[key]!="function") retarr[key]=this[key];
  return retarr;
};
Cactus.prototype.save = function() {
  $.jStorage.set("game", this.getAsData());
};
Cactus.prototype.load = function() {
  var loaded=$.jStorage.get('game');
  for(key in loaded) this[key]=loaded[key];
};
