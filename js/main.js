var cactus, welcomePreviewMoving=false;
$(document).ready(function() {
  cactus = new Cactus();
  var maxcactusid=3, maxflowerpotsid=3;
  cactus.load();
  if(cactus.alive)  cactus.computeUpdate(); else cactus.updateUI();
  
  $('#welcome .next, #welcome .previous').click(function(){
	  if(!welcomePreviewMoving) {
		  welcomePreviewMoving=true;
		  var ischangingcactus=$(this).parent().is($('#welcomecactus'));
		  if($(this).is($('#welcome .previous'))) var moving=-1; else var moving=1;
		  var thisid=parseInt($(this).parent().find('.preview').attr('data-id'))+moving;
		  if((ischangingcactus && thisid>maxcactusid) || (!ischangingcactus && thisid>maxflowerpotsid)) thisid=1;
		  if(thisid<1) if(ischangingcactus) thisid=maxcactusid; else thisid=maxflowerpotsid;
		  $(this).parent().find('.preview').attr('data-id', thisid);
		  if(ischangingcactus) var imgurl='cactus'; else var imgurl='flowerpots';
		  
		  $(this).parent().find('.preview.aux').css('margin-left', (moving*100)+'%').css('background-image', 'url(img/'+imgurl+'/'+thisid+'.png)');
		  $(this).parent().find('.preview.aux').animate({
			  "margin-left": '15%',
		  }, 500);
		  $(this).parent().find('.preview.main').animate({
			  "margin-left": (moving==1 ? -200 : 400)+'px',
		  }, 500);
		  setTimeout(function(that, imgurl, thisid) {
			that.find('.preview.main').css('background-image', 'url(img/'+imgurl+'/'+thisid+'.png)').css('margin-left', '15%');
			that.find('.preview.aux').css('margin-left', '100%');
			welcomePreviewMoving=false;
			that.find('.title').html(cactus.getRandomTitle(that.is($('#welcomecactus'))));
		  }, 500+50, $(this).parent(), imgurl, thisid);
	  }
  });
  $('#welcome .done').click(function(){
      var ischangingcactus=$(this).parent().parent().is($('#welcomecactus'));
      var thisid=parseInt($(this).parent().parent().find('.preview').attr('data-id'));
      if(ischangingcactus) {
        cactus.cactus=thisid;
        windowResize();
      } else cactus.flowerpot=thisid;
      cactus.updateUI();
  });
  $('#view>div').click(function(){
      cactus.humidity+=10;
      cactus.computeUpdate();
      $('#thoughts').html(cactus.getRandomWateringThought());
	  for(k=0;k<20;k++) {
		  var y=Math.random()*40-40;
		 $('<div class="drop"><i class="fa fa-tint"></i></div>').appendTo('#view').css('left', ($(window).width()/2-60+115*Math.random())+'px').css('top', y+'%')
		 .animate({'top': (150+y)+'%'}, 2000,"linear",function(){$(this).remove();});
	  }
	  });
  $('#tipsarea').click(function(){
      $('#tipsarea').stop(true, true).fadeOut(500);
  });
  setInterval("cactus.computeUpdate()", 30000);
  $(window).on('resize', function(e) {windowResize()});
  windowResize();
});
var windowResize=function() {
  switch(cactus.cactus) {
    case 1: var hardcodedheight=260; break;
    case 2: var hardcodedheight=323; break;
    case 3: var hardcodedheight=193; break;
  }
  $('#view .cactus').css('background-position-y', ($(window).height()-hardcodedheight)+'px');
  $('#thoughtsarea').css('right', ($(window).width()/2-300)+'px');
};
var Cactus=function() {this.initialize()};
Cactus.prototype.initialize=function() {
      this.alive= false;
      this.cactus= -1;
      this.flowerpot= -1;
};
Cactus.prototype.computeUpdate=function() {
	if(this.alive) {
	  var delta=Math.floor(new Date()/1000)-this.lastupdated;
	  this.updateLastUpdated();
	  this.humidity-=delta*25/7/24/60/60;
	  if(this.humidity<0) this.kill();
	  else if(this.humidity>100) this.kill();
	  this.age+=delta/24/60/60;
	  this.updateUI();
	}
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
      this.humidity= 15;
      this.updateLastUpdated();
      this.updateUI();
      $('#tips').html('Watering increases the humidity. Don\'t let it dry, but don\'t drown it. Humidity decreases a little bit each day');
      $('#tipsarea').stop(true, true).fadeIn(500);
	  setTimeout("$('#tipsarea').stop(true, true).fadeOut(500)", 5000);
    }
  } else {
    $('#welcome').stop(true, true).fadeOut(500);
    $('#game').stop(true, true).fadeIn(500);
    $('#mark>div').stop(true, true).animate({'width': this.humidity+'%'}, 750);
    $('#view .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#view .flowerpot').css('background-image', 'url(img/flowerpots/'+this.flowerpot+'.png)');
    $('#age').html('Age: '+Math.floor(this.age)+' days');
    $('#thoughts').html(cactus.getRandomThought());
    $('#thoughtsarea').stop(true, true).fadeIn(500);
	setTimeout("$('#thoughtsarea').stop(true, true).fadeOut(500)", 10000);
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
Cactus.prototype.getRandomTitle=function() {
  var titles=[
  'Ooooh, that looks sharp!',
  'It\'s crafted with love!',
  'Doesn\'t do much, does it?'
  ];
  return titles[Math.floor(Math.random()*titles.length)];
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
