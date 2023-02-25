stars = 0;
/* how often stars will fly across the screen, default is one second */
const STAR_SPACING = 1000
/* this constant doesn't really do much */
const STAR_DURATION = 10000

function addShootingStarToQueue() {
	stars++;
}

/* makes a star that flies across the page */
function createStar() {
	let image = document.createElement("img");
	image.src = "jpegglypuff.jpg";
	image.classList.add("rotate", "nromal");
	let div = document.createElement("div");
	div.classList.add("fly-across-screen");
	//div.appendChild(sound);
	div.appendChild(image);
	div.style.top = `calc(${((Math.random()*60)+20)+"vh"} - var(--puff-height))`;
	document.body.appendChild(div);
	let sound = document.querySelector(".sound");
	try {
		sound.play();
	} catch(e) {
		console.log("hey you need to click on the window first for sound to play :/");
	}
	setTimeout(_=>document.body.removeChild(_), STAR_DURATION, div);
}

setInterval(_=>{
	if (stars > 0) {
		stars--;
		createStar();
	}
}, STAR_SPACING);