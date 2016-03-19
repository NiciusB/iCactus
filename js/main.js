var cactus;
$(function() {
  cactus = $.jStorage.get('game');
  var maxcactusid=2, maxflowerpotsid=2;
  if(cactus==undefined) {
    cactus=new Cactus();
  }
  cactus.computeUpdate();
  
  $('#welcome .next, #welcome .previous').click(function(){
      var ischangingcactus=$(this).parent().is($('#welcomecactus'));
      var thisid=parseInt($(this).parent().find('.preview').attr('data-id'))+1;
      if((ischangingcactus && thisid>maxcactusid) || (!ischangingcactus && thisid>maxflowerpotsid)) thisid=1;
      $(this).parent().find('.preview').attr('data-id', thisid);
      if(ischangingcactus)
      $(this).parent().find('.preview').css('background-image', 'url(img/cactus/'+thisid+'.png)');
      else
      $(this).parent().find('.preview').css('background-image', 'url(img/flowerpot/'+thisid+'.png)');
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
      $('#view').fadeOut(200, function() { $(this).fadeIn(200); });
  });
});
var Cactus=function() {this.initialize()};
Cactus.prototype.initialize=function() {
      this.alive= false;
      this.cactus= -1;
      this.flowerpot= -1;
};
Cactus.prototype.updateUI=function() {
  this.save();
  if(!this.alive) {
    $('#welcome').fadeIn(500);
    $('#game').fadeOut(500);
    if(this.cactus==-1) {
      $('#welcome>div').fadeOut(500);
      $('#welcome #welcomecactus').fadeIn(500);
      $('#welcome #welcomecactus .title').html('Select your cactus!');
      $('#welcome #welcomecactus .preview').css('background-image', 'url(img/cactus/1.png)');
      $('#welcome #welcomecactus .preview').attr('data-id', '1');
    } else if(this.flowerpot==-1) {
      $('#welcome>div').fadeOut(500);
      $('#welcome #welcomeflowerpot').fadeIn(500);
      $('#welcome #welcomeflowerpot .title').html('Select your flower pot!');
      $('#welcome #welcomeflowerpot .preview').css('background-image', 'url(img/cactus/1.png)');
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
    $('#welcome').fadeOut(500);
    $('#game').fadeIn(500);
    $('#humiditymeter .mark').html(this.humidity+'%');
    $('#view .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#view .flowerpot').css('background-image', 'url(img/flowerpot/'+this.flowerpot+'.png)');
    $('#age').html(this.age+' days');
    $('#thoughts').html(cactus.getRandomThought());
  }
};
Cactus.prototype.computeUpdate = function() {
  var delta=Math.floor(new Date()/1000)-this.lastupdated;
  Cactus.prototype.updateLastUpdated();
  this.humidity-=delta*25/7/24/60/60;
  if(this.humidity<0) this.kill();
  else if(this.humidity>200) this.kill();
  this.updateUI();
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
Cactus.prototype.save = function() {
  $.jStorage.set("game", this);
};
