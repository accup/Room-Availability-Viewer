/// <reference path="./overdrive.js" />
/// <reference path="./schedule.js" />

window.addEventListener('load-schedules', (e) => {
	let year1 = document.getElementById("clock-year-1");
	let year2 = document.getElementById("clock-year-2");
	let year3 = document.getElementById("clock-year-3");
	let year4 = document.getElementById("clock-year-4");
	let month1 = document.getElementById("clock-month-1");
	let month2 = document.getElementById("clock-month-2");
	let date1 = document.getElementById("clock-date-1");
	let date2 = document.getElementById("clock-date-2");

	let day1 = document.getElementById("clock-day-1");
	let day2 = document.getElementById("clock-day-2");
	let day3 = document.getElementById("clock-day-3");

	let hour1 = document.getElementById("clock-hour-1");
	let hour2 = document.getElementById("clock-hour-2");
	let minute1 = document.getElementById("clock-minute-1");
	let minute2 = document.getElementById("clock-minute-2");
	let second1 = document.getElementById("clock-second-1");
	let second2 = document.getElementById("clock-second-2");

	let holiday = document.getElementById("clock-holiday-name");

	let colons = document.querySelectorAll("svg#clock-frame > .clock-colon");

	let days = [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	];

	let controllers = getControllers();

	void function loop (old_D, old_s) {
		let now = new Date();
		// transition のインターバル分の調整
		let ms = now.getMilliseconds();
		now.setMilliseconds(ms + 400);

		if (ms < 500) {
			for (let i=0, n=colons.length; i<n; ++i) {
				colons[i].classList.add("clock-colon-on");
			}
		}
		else {
			for (let i=0, n=colons.length; i<n; ++i) {
				colons[i].classList.remove("clock-colon-on");
			}
		}
		
		let now_s = now.getSeconds();
		let now_D = now.getDate();
		if (old_s != now_s) {
			let h = NumberEx.toZeroPadding(now.getHours(), 2);
			let m = NumberEx.toZeroPadding(now.getMinutes(), 2);
			let s = NumberEx.toZeroPadding(now_s, 2);
			hour1.setAttribute("data-number", h[0]);
			hour2.setAttribute("data-number", h[1]);
			minute1.setAttribute("data-number", m[0]);
			minute2.setAttribute("data-number", m[1]);
			second1.setAttribute("data-number", s[0]);
			second2.setAttribute("data-number", s[1]);

			controllers.forEach((c) => {
				c.update(now);
			});

			if (old_D != now_D) {
				let now_Y = now.getFullYear();
				let now_M = now.getMonth() + 1;
				let Y = NumberEx.toZeroPadding(now_Y, 4);
				let M = NumberEx.toZeroPadding(now_M, 2);
				let D = NumberEx.toZeroPadding(now_D, 2);
				let d = now.getDay();
				year1.setAttribute("data-number", Y[0]);
				year2.setAttribute("data-number", Y[1]);
				year3.setAttribute("data-number", Y[2]);
				year4.setAttribute("data-number", Y[3]);
				month1.setAttribute("data-number", M[0]);
				month2.setAttribute("data-number", M[1]);
				date1.setAttribute("data-number", D[0]);
				date2.setAttribute("data-number", D[1]);

				day1.setAttribute("data-alphabet", days[d][0]);
				day2.setAttribute("data-alphabet", days[d][1]);
				day3.setAttribute("data-alphabet", days[d][2]);

				holiday.textContent = DateEx.getHolidayName(now_Y, now_M, now_D);
			}
		}

		setTimeout(loop, 100, now_D, now_s);
	}(-1, -1);
});