(function(window){
	window.addEventListener('DOMContentLoaded', function(){
		var cSpeed=9;
		var cWidth=200;
		var cHeight=25;
		var cTotalFrames=16;
		var cFrameWidth=200;
		var cImageSrc='/images/sprites.gif';
	
		var cImageTimeout=false;
		
		function startAnimation(){
			
			var loader = document.getElementById('loaderImage');

			if(!loader){
				return;
			}
				
			loader.innerHTML='<canvas id="canvas" width="'+cWidth+'" height="'+cHeight+'"><p>Your browser does not support the canvas element.</p></canvas>';
			
			//FPS = Math.round(100/(maxSpeed+2-speed));
			FPS = Math.round(100/cSpeed);
			SECONDS_BETWEEN_FRAMES = 1 / FPS;
			g_GameObjectManager = null;
			g_run=genImage;

			g_run.width=cTotalFrames*cFrameWidth;
			genImage.onload=function (){cImageTimeout=setTimeout(fun, 0)};
			initCanvas(g_run, cTotalFrames, FPS);
		}
		
		
		function imageLoader(s, fun)//Pre-loads the sprites image
		{
			clearTimeout(cImageTimeout);
			cImageTimeout=0;
			genImage = new Image();
			genImage.onload=function (){cImageTimeout=setTimeout(fun, 0)};
			genImage.onerror=new Function('alert(\'Could not load the image\')');
			genImage.src=s;
		}
		
		//The following code starts the animation
		new imageLoader(cImageSrc, startAnimation);
	});
	
}(this));
