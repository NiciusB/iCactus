var cactus;
$(function() {
  cactus = $.jStorage.get('game');
  var maxcactusid=2, maxflowerpotsid=2;
  if(cactus==undefined) {
    cactus=new Cactus();
  }
  cactus.updateUI();
  
  $('#welcome .next, #welcome .previous').click(function(){
      var ischangingcactus=$(this).parent()==$('#welcomecactus');
      var thisid=parseInt($(this).parent().find('.preview').attr('data-id'))+1;
      if((ischangingcactus && thisid>maxcactusid) || (!ischangingcactus && thisid>maxflowerpotsid)) thisid=1;
      $(this).parent().find('.preview').attr('data-id', thisid);
      $(this).parent().find('.preview').css('background-image', 'url(img/cactus/'+thisid+'.png)');
  });
  $('#welcome .done').click(function(){
      var ischangingcactus=$(this).parent().parent()==$('#welcomecactus');
      var thisid=parseInt($(this).parent().parent().find('.preview').attr('data-id'));
      if(ischangingcactus) cactus.cactus=thisid; else cactus.flowerpot=thisid;
      cactus.updateUI();
  });
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
    }
  } else {
    $('#welcome').fadeOut(500);
    $('#game').fadeIn(500);
    $('#humiditymeter .mark').html(this.humidity);
    $('#view .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#view .flowerpot').css('background-image', 'url(img/cactus/'+this.flowerpot+'.png)');
    $('#age').html(this.age+' days');
    
  }
};
Cactus.prototype.updateLastUpdated = function() {
  this.lastupdated=Math.floor(new Date()/1000);
};
Cactus.prototype.save = function() {
  $.jStorage.set("game", this);
};
