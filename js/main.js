var cactus, welcomePreviewMoving=false, fullscreenmsgTimeout, thoughtTimeout;
var wiki={
	cactus: [144, 155, 69],
	flowerpots: [58, 58, 58],
	accesories: {
		extras: [[-50, 130]],
		hats: [[-20, 54], [-54, 54], [-40, 54], [-40, 8]],
		glasses: [[20,40], [20,50], [20,40], [40, 51]],
	}
};
$(document).ready(function() {
  cactus = new Cactus();
  cactus.load();
  if(cactus.alive)  cactus.computeUpdate(); else cactus.updateUI();
  
  $('#welcome .next, #welcome .previous').click(function(){
	  if(!welcomePreviewMoving) {
		  welcomePreviewMoving=true;
		  var ischangingcactus=$(this).parent().is($('#welcomecactus'));
		  if($(this).is($('#welcome .previous'))) var moving=-1; else var moving=1;
		  var thisid=parseInt($(this).parent().find('.preview').attr('data-id'))+moving;
		  if((ischangingcactus && thisid>wiki.cactus.length) || (!ischangingcactus && thisid>wiki.flowerpots.length)) thisid=1;
		  if(thisid<1) if(ischangingcactus) thisid=wiki.cactus.length; else thisid=wiki.flowerpots.length;
		  $(this).parent().find('.preview').attr('data-id', thisid);
		  if(ischangingcactus) var imgurl='cactus'; else var imgurl='flowerpots';
		  
		  $(this).parent().find('.preview.aux').css('margin-left', (moving*100)+'%').css('background-image', 'url(img/'+imgurl+'/'+thisid+'.png)');
		  $(this).parent().find('.preview.aux').animate({
			  "margin-left": '15%',
		  }, 500);
		  $(this).parent().find('.preview.main').animate({
			  "margin-left": (-moving*100)+'%',
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
  $('#view').click(function(){
      cactus.humidity+=12.5;
      cactus.computeUpdate();
      cactus.setThought(cactus.getRandomWateringThought());
	  for(k=0;k<20;k++) {
		  var y=Math.random()*40-40;
		 $('<div class="drop"><i class="fa fa-tint"></i></div>').appendTo('#game').css('left', ($(window).width()/2-wiki.flowerpots[cactus.flowerpot-1]+2*wiki.flowerpots[cactus.flowerpot-1]*Math.random())+'px').css('top', y+'%')
		 .animate({'top': (150+y)+'%'}, 2000,"linear",function(){$(this).remove();});
	  }
	  });
  $('#fullscreenmessage').click(function(){
	  clearTimeout(fullscreenmsgTimeout);
      $('#fullscreenmessage').stop(true, true).fadeOut(500);
  });
  $('#button_accesories').click(function(){
	  cactus.showAccesoriesMenu();
  });
  $('#accesories .done').click(function(){
	  cactus.hideAccesoriesMenu();
  });
  setInterval("cactus.computeUpdate()", 30000);
  $(window).on('resize', function(e) {windowResize()});
  windowResize();
});
var Cactus=function() {this.initialize()};
Cactus.prototype.initialize=function() {
      this.alive= false;
      this.cactus= -1;
      this.flowerpot= -1;
      this.accesories={};
	  for(k in wiki.accesories)this.accesories[k]=0;
};
Cactus.prototype.computeUpdate=function() {
	if(this.alive) {
	  var delta=Math.floor(new Date()/1000)-this.lastupdated;
	  this.updateLastUpdated();
	  this.humidity-=delta*12.5/7/24/60/60;
	  if(this.humidity<0) this.kill('dry');
	  else if(this.humidity>100) this.kill('drown');
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
	  this.fullScreenMessage('Touch the cactus to water it. Don\'t let it dry, but don\'t drown it.<br> Humidity decreases a little bit each day');
    }
  } else {
    $('#welcome').stop(true, true).fadeOut(500);
    $('#game').stop(true, true).fadeIn(500);
    $('#mark>div').stop(true, true).animate({'width': this.humidity+'%'}, 750);
    $('#view .cactus').css('background-image', 'url(img/cactus/'+this.cactus+'.png)');
    $('#view .flowerpot').css('background-image', 'url(img/flowerpots/'+this.flowerpot+'.png)');
    $('#view .accesories').html('');
	for(key in this.accesories) {
		if(this.accesories[key]>0)$('#view .accesories').append('<div class="'+key+'" style="top:'+wiki.accesories[key][this.accesories[key]-1][0]+'px;left:'+wiki.accesories[key][this.accesories[key]-1][1]+'px;background-image: url(\'img/accesories/'+key+'/'+this.accesories[key]+'.png\');"></div>');
	}
    $('#age').html('Age: '+(Math.floor(this.age*10)/10)+' days');
	this.setThought(cactus.getRandomThought());
  }
};
Cactus.prototype.kill = function(reason) {
  this.initialize();
  this.updateUI();
  switch(reason) {
	  case 'dry': var msg='You have neglected your cactus<br>Please, remember to water it the next time'; break;
	  case 'drown': var msg='You have drowned your cactus<br>Watch your water, boy'; break;
  }
  this.fullScreenMessage(msg);
};
Cactus.prototype.fullScreenMessage = function(msg) {
  clearTimeout(fullscreenmsgTimeout);
  $('#fullscreenmessage p').html(msg);
  $('#fullscreenmessage').stop(true, true).fadeIn(100);
  fullscreenmsgTimeout=setTimeout("$('#fullscreenmessage').stop(true, true).fadeOut(500)", 10000);
};
Cactus.prototype.setThought = function(msg) {
  clearTimeout(thoughtTimeout);
  $('#thoughts').html(msg);
  $('#thoughtsarea').stop(true, true).fadeIn(500);
  thoughtTimeout=setTimeout("$('#thoughtsarea').stop(true, true).fadeOut(500)", 10000);
};
Cactus.prototype.updateLastUpdated = function() {
  this.lastupdated=Math.floor(new Date()/1000);
};
Cactus.prototype.getRandomWateringThought = function() {
  var thoughts=[
  'Where can one go to the toilet around here?',
  'HALLELUJAH',
  'I\'m so happy I could die',
  'Do you treat all cacti like this?',
  'How you dooooin\'?',
  'KEEP IT COMING. <br> Wait, no, don\'t do that',
  ];
  return thoughts[Math.floor(Math.random()*thoughts.length)];
};
Cactus.prototype.getRandomThought = function() {
  var thoughts=[
  'I think this accupunture is really working!',
  'Mo\' Water Mo\' Problems',
  'Are you really that bored?',
  'I love you',
  'I have a drinking problem',
  'Green is not a creative colour',
  'Wow, this art really sucks',
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
Cactus.prototype.showAccesoriesMenu = function() {
	$('#accesories>div').html('');
	for(key in wiki.accesories){
		switch(key) {
			case 'extras': var txtname='Extras'; break;
			case 'glasses': var txtname='Glasses'; break;
			case 'hats': var txtname='Hats'; break;
		}
		carrouseltxt='<div '+(this.accesories[key]==0 ? 'class="active"' : '') +' data-id="0" style="background-image: url(\'img/accesories/none.png\')"></div>';
		for(n in wiki.accesories[key]) {
			carrouseltxt+='<div '+(this.accesories[key]==(parseInt(n)+1) ? 'class="active"' : '')+' data-id="'+(parseInt(n)+1)+'" style="background-image: url(\'img/accesories/'+key+'/'+(parseInt(n)+1)+'.png\')"></div>';
		}
		$('#accesories>div').append('<div><div class="title">'+txtname+'</div><div class="carrousel"><div data-id="'+key+'">'+carrouseltxt+'</div></div></div>');
	}	
	$('#accesories').stop(true, true).fadeIn(500);
	$('#accesories>div>div>div.carrousel>div>div').click(function(){
		cactus.accesories[$(this).parent().attr('data-id')]=$(this).attr('data-id');
		cactus.showAccesoriesMenu();
		cactus.updateUI();
	});
};
Cactus.prototype.hideAccesoriesMenu = function() {
	$('#accesories').stop(true, true).fadeOut(500);
};



var windowResize=function() {
  var cactusheight=wiki.cactus[cactus.cactus-1];
  $('#view').css('height', (cactusheight+125)+'px');
  $('#view').css('left', ($(window).width()/2-90)+'px');
  $('#view .cactus').css('height', (cactusheight)+'px');
  $('#accesories>div').css('height', ($(window).height()-50)+'px');
  
  $('#thoughtsarea').css('bottom', (125+cactusheight)+'px');
  var rightpos=($(window).width()/2-200);
  if(rightpos<0) rightpos=0;
  $('#thoughtsarea').css('right', rightpos+'px');
};