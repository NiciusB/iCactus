$(function() {
  var cactus = $.jStorage.get('game');
  if(cactus==undefined) {
    cactus=new Cactus();
  }
  cactus.updateUI();
});
var Cactus=function() {
      this.alive= false;
      this.cactus= -1;
      this.flowerpot= -1;
};
Cactus.prototype.updateUI=function() {
  if(!this.alive) {
    $('#welcome').fadeIn(500);
    $('#game').fadeOut(500);
    if(this.cactus==-1) {
      $('#welcome>div').fadeOut(500);
      $('#welcome #welcomecactus').fadeIn(500);
      $('#welcome #welcomecactus .title').html('Select your cactus!');
    } else if(this.flowerpot==-1) {
      $('#welcome>div').fadeOut(500);
      $('#welcome #welcomeflowerpot').fadeIn(500);
      $('#welcome #welcomeflowerpot .title').html('Select your flower pot!');
    } else {
      this.alive= true;
      this.age= 0;
      this.humidity= 25;
      this.updateLastUpdated();
      this.updateUI();
    }
  } else {
    $('#welcome').fadeOut(500;
    $('#game').fadeIn(500);
    $('#humiditymeter .mark').html(this.humidity);
    $('#cactus .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#cactus .flowerpot').css('background-image', 'url(img/cactus/'+this.flowerpot+'.png)');
    $('#age').html(this.age+' days');
    
  }
};
Cactus.prototype.updateLastUpdated = function() {
  this.lastupdated=Math.floor(new Date()/1000);
};
Cactus.prototype.save = function() {
  $.jStorage.set("game", this);
};
