/// <reference path="DomHash.js" />

window.addEventListener('load', function (e) {
	let mn_open = document.getElementById("manual-open");
	let mn_close = document.getElementById("manual-close");

	mn_open.addEventListener('click', (e) => {
		if ("manual" !== DomHash.hash) {
			// マニュアルを開く
			DomHash.hash = "manual";
		}
	});
	mn_close.addEventListener('click', (e) => {
		// マニュアルを閉じる
		DomHash.hash = "";
	});
});