/** 	=========================
	Template Name 	 : Dating Kit
	Author			 : DexignZone
	Version			 : 1.0
	File Name		 : custom.js
	Author Portfolio : https://themeforest.net/user/dexignzone/portfolio

	Core script to handle the entire theme and core functions
**/

$(document).ready(function() {

	var animating = false;
	var cardsCounter = 0;
	var numOfCards = jQuery('.demo__card').length;
	var decisionVal = 80;
	var pullDeltaX = 0;
	var pullDeltaY = 0;
	var deg = 0;
	var $card, $cardReject, $cardLike;
	
	function pullChange() {
		animating = true;
		deg = pullDeltaX / 10;
		degY = pullDeltaY / 10;
		var superlike = false;
		if(Math.abs(pullDeltaY) > Math.abs(pullDeltaX)){
			superlike = true;
		}
		
		if(superlike){
			$card.css("transform", "translateY(-"+ pullDeltaY +"px)");	
		}else{
			$card.css("transform", "translateX("+ pullDeltaX +"px) rotate("+ deg +"deg)");	
		}

		
		
		

		//$card.css("transform", "translate("+ pullDeltaX +"px , -"+pullDeltaY+"px) rotate("+ deg +"deg)");

		//translate(-50px, -50px) rotate(-30deg)
		//console.log('pullDeltaY->'+pullDeltaY);

		var opacity = pullDeltaX / 100;
		var opacityY = pullDeltaY / 100;

		//console.log('opacityY->'+opacityY);

		var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
		var likeOpacity = (opacity <= 0) ? 0 : opacity;
		
		//console.log('likeOpacity--'+likeOpacity);
		
		var superlikeOpacity = (opacityY <= 0) ? 0 : opacityY;
		//console.log('superlikeOpacity-'+superlikeOpacity);
		$cardReject.css("opacity", rejectOpacity);
		$cardLike.css("opacity", likeOpacity);
		if(superlike){
			$cardSuperLike.css("opacity", superlikeOpacity);
		}
	}

	function release() {

		if (pullDeltaX >= decisionVal) {
			$card.addClass("to-right");
			onSwipe($card.data('profile-id'), 'like'); // Suponiendo que el ID del perfil está almacenado en un atributo data llamado 'profile-id'
			console.log("Si")
		} else if (pullDeltaX <= -decisionVal) {
			$card.addClass("to-left");
			onSwipe($card.data('profile-id'), 'dislike');
			console.log("No")
		}

		if (Math.abs(pullDeltaX) >= decisionVal) {
		  $card.addClass("inactive");

		  setTimeout(function() {
			$card.addClass("below").removeClass("inactive to-left to-right");
			cardsReset();
		  }, 300);
		}

		if (Math.abs(pullDeltaX) < decisionVal) {
		  $card.addClass("reset");
		}

		setTimeout(function() {
		  $card.attr("style", "").removeClass("reset")
			.find(".demo__card__choice").attr("style", "");

		  pullDeltaX = 0;
		  animating = false;
		}, 300);
	}
  
	function releaseY() {

		if (pullDeltaY >= decisionVal) {
			$card.addClass("to-upside");
			onSwipe($card.data('profile-id'), 'like');
			console.log("Si")
		} else if (pullDeltaY <= -decisionVal) {
			$card.addClass("to-downside");
			onSwipe($card.data('profile-id'), 'dislike');
			console.log("No")
		}

		if (Math.abs(pullDeltaY) >= decisionVal) {
		  $card.addClass("inactive");

			setTimeout(function() {
				$card.addClass("below").removeClass("inactive to-upside to-downside");
				cardsReset();
			}, 300);
		}

		if (Math.abs(pullDeltaY) < decisionVal) {
		  $card.addClass("reset");
		}

		setTimeout(function() {
		  $card.attr("style", "").removeClass("reset")
			.find(".demo__card__choice").attr("style", "");

		  pullDeltaY = 0;
		  animating = false;
		}, 300);
	}
	
	function cardsReset(){
		cardsCounter++;
		if (cardsCounter === numOfCards) {
		  cardsCounter = 0;
		  $(".demo__card").removeClass("below");
		}
	}
  

	$(document).on("mousedown touchstart", ".demo__card:not(.inactive)",  function(e) {
		if (animating) return;

		$card = $(this);
		$cardReject = $(".demo__card__choice.m--reject", $card);
		$cardLike = $(".demo__card__choice.m--like", $card);
		$cardSuperLike = $(".demo__card__choice.m--superlike", $card);
		var startX =  e.pageX || e.originalEvent.touches[0].pageX;
		var startY =  e.pageY || e.originalEvent.touches[0].pageY;

		$(document).on("mousemove touchmove", function(e) {
		  var x = e.pageX || e.originalEvent.touches[0].pageX;
		  var y = e.pageY || e.originalEvent.touches[0].pageY;
		  //console.log('Y-'+y);
		  //console.log('startY-'+startY);
		  pullDeltaX = (x - startX);
		  pullDeltaY = (startY - y);
		  
		  //console.log('pullDeltaX->'+pullDeltaX);
		  if (!pullDeltaX && !pullDeltaY){
			  return;
		  }
		  //if (!pullDeltaX) return;
		  //if (!pullDeltaY) return;
		  pullChange();
		});

		$(document).on("mouseup touchend", function() {
			//console.log(11111111111);
			$(document).off("mousemove touchmove mouseup touchend");
		  
			if (Math.abs(pullDeltaX) < Math.abs(pullDeltaY)){
				releaseY();
			}else if (Math.abs(pullDeltaX) > 0){
				release();
			}
		  
		  //if (!pullDeltaX) return; // prevents from rapid click events
		  //if (!pullDeltaY) return; // prevents from rapid click events
		  //release();
		});
	});
	
	jQuery('.dz-sp-like').on('click',function(){
		var elementB = jQuery(this).parents('.demo__card');
		var elementSL = elementB.find('.demo__card__choice.m--superlike')
		elementSL.css('opacity','1');
		elementB.slideUp(300, function() {
			cardsReset();
			setTimeout(function() {
				elementB.addClass('below').css('display','');
				elementSL.css('opacity','');
			}, 500); 
		});
	});

});