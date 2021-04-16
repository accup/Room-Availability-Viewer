/// <reference path="DomHash.js" />
/// <reference path="parseTimeLine.js" />
/// <reference path="schedule.js" />

window.addEventListener('load-schedules', (e) => {
	let cl_title_lr = document.getElementById("calendar-title");
	let cl_title = cl_title_lr.querySelector("div.calendar-value");
	let cl_year_lr = document.getElementById("calendar-year");
	let cl_year = cl_year_lr.querySelector("div.calendar-value")
	let cl_month_lr = document.getElementById("calendar-month");
	let cl_month = cl_month_lr.querySelector("div.calendar-value")
	let cl_close = document.getElementById("calendar-close");
	let cl_time_scale = document.getElementById("calendar-frame-time-scale");
	let cl_date_scale = document.getElementById("calendar-frame-date-scale");
	let cl_list = document.getElementById("calendar-list");
	
	let daysJP = "日月火水木金土";
	
	let width_per_hour = 56;
	let height_per_date = 20;
	{		
		for (let i=0; i<24; ++i) {
			let cl_time_num = document.createElement('div');
			cl_time_num.classList.add('calendar-frame-time-num');
			cl_time_num.style.width = `${width_per_hour}px`;
			cl_time_num.textContent = i;
			cl_time_scale.appendChild(cl_time_num);
		}
	}
	
	cl_close.addEventListener('click', () => {
		DomHash.hash = "";
	});
	
	let ticking = false;
	cl_list.addEventListener('scroll', function (e) {
		if (!ticking) {
			requestAnimationFrame(function() {
				cl_time_scale.style.marginLeft = `${-cl_list.scrollLeft}px`;
				cl_date_scale.style.marginTop = `${-cl_list.scrollTop}px`;
				ticking = false;
			});
			ticking = true;
		}
	});
	
	let ctrls = getControllers();
	
	let currentInfo = {
		index: 0,
		year: 0,
		month: 0,
		date: 0
	};
	function setCalendarMonth (index, y, m) {
		let l = ctrls.length;
		while (index < 0) index += l;
		while (l <= index) index -= l;
		
		let ctrl = ctrls[currentInfo.index = index];
		
		// 翌月の0日 = 今月の末日 を返す。
		let fixdate = new Date(+y, +m, 0);
		let year = currentInfo.year = fixdate.getFullYear();
		let month = currentInfo.month = fixdate.getMonth() + 1;
		
		// まず内容を空にする
		{
			let first;
			while (first = cl_date_scale.firstChild)
			cl_date_scale.removeChild(first);
			while (first = cl_list.firstChild)
			cl_list.removeChild(first);
		}
		
		// 表示を更新
		cl_title.textContent = (ctrl) ? ctrl.calendar.name : "Calendar";
		cl_year.textContent = `${year}年`;
		cl_month.textContent = `${month}月`;
		
		// その他の処理は以下
		
		// 末日取得
		let monthEnd = fixdate.getDate();
		
		let firstDay = new Date(year, month-1, 1).getDay();
		
		let ms1 = DateEx.hms(1, 0);
		
		// その月の日付の設定をする
		for (let date = 1, day = firstDay; date <= monthEnd; ++date) {
			let cl_date_item = document.createElement('div');
			cl_date_item.classList.add('calendar-frame-date-item');
			
			let cl_date_item_num = document.createElement('span');
			cl_date_item_num.classList.add('calendar-frame-date-item-num');
			cl_date_item_num.textContent = date;
			let cl_date_item_day = document.createElement('span');
			cl_date_item_day.classList.add('calendar-frame-date-item-day');
			cl_date_item_day.textContent = daysJP[day];
			
			let cl_date_item_name = document.createElement('span');
			cl_date_item_name.classList.add('calendar-frame-date-item-name');
			
			let holiday_name = DateEx.getHolidayName(year, month, date, day);
			if ("" !== holiday_name) {
				cl_date_item_day.style.color = "#FF1010";					
				cl_date_item_name.textContent = holiday_name;
			}
			else if (0 === day) {
				cl_date_item_day.style.color = "#FF1010";
			}
			else if (6 === day) {
				cl_date_item_day.style.color = "#0093FF";
			}
			
			cl_date_item.appendChild(cl_date_item_num);
			cl_date_item.appendChild(cl_date_item_day);
			cl_date_item.appendChild(cl_date_item_name);
			
			cl_date_scale.appendChild(cl_date_item);
			
			if (6 < ++day) day = 0;
		}
		if (ctrl instanceof ScheduleController) {
			// コントローラに登録されたカレンダーから、その月のスケジュールを割り出す。
			for (let date = 1, day = firstDay; date <= monthEnd; ++date) {
				let cl_date = document.createElement('div');
				cl_date.classList.add('calendar-date');
				
				
				let pl = ctrl.searchMetPlan(year, month, date);
				let sc = pl.schedules[day];
				
				let lastTime = 0;
				for (let i=0, n=sc.statuses.length; i<n; ++i) {
					let s = sc.statuses[i];
					
					if (lastTime < s.begin) {
						let cl_opened_time = document.createElement('div');
						cl_opened_time.classList.add('calendar-time');
						cl_opened_time.style.flexBasis = `${(s.begin - lastTime) * width_per_hour / ms1}px`;
						cl_opened_time.textContent = "利用可";
						
						cl_date.appendChild(cl_opened_time);
					}
					
					let cl_time = document.createElement('div');
					cl_time.classList.add('calendar-time');
					cl_time.style.flexBasis = `${(s.end - s.begin) * width_per_hour / ms1}px`;
					cl_time.textContent = s.state_text;
					
					if (StatusType.closed === s.state) {
						cl_time.classList.add('calendar-closed-time');
					}
					else if (StatusType.used === s.state) {
						cl_time.classList.add('calendar-used-time');
					}
					
					cl_date.appendChild(cl_time);
					
					lastTime = s.end;
				}
				
				cl_list.appendChild(cl_date);
				
				if (6 < ++day) day = 0;
			}
		}
		else {
			for (let date = 1; date <= monthEnd; ++date) {
				let cl_date = document.createElement('div');
				cl_date.classList.add('calendar-date');
				let cl_time = document.createElement('div');
				cl_time.classList.add('calendar-time');
				cl_time.style.flexBasis = `0px`;
				cl_date.appendChild(cl_time);
				cl_list.appendChild(cl_date);
			}
		}
	}
	
	ctrls.forEach((elm, index) => {
		elm.rootElement.addEventListener('click', () => {
			// カレンダーを開く
			DomHash.hash = "calendar";
			
			let dateobj = new Date();
			let year = dateobj.getFullYear();
			let month = dateobj.getMonth() + 1;
			
			setCalendarMonth(index, year, month);
			
			let date = dateobj.getDate();
			let hour = dateobj.getHours();
			cl_list.scrollLeft = width_per_hour * (hour - 2);
			cl_list.scrollTop = height_per_date * (date - 2);
		});
	});
	
	// 左右ボタン実装
	{
		let cl_title_shift_l = cl_title_lr.querySelector('.calendar-left');
		let cl_title_shift_r = cl_title_lr.querySelector('.calendar-right');
		cl_title_shift_l.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index - 1,
				currentInfo.year,
				currentInfo.month
			);
		});
		cl_title_shift_r.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index + 1,
				currentInfo.year,
				currentInfo.month
			);
		});
	}
	{
		let cl_year_shift_l = cl_year_lr.querySelector('.calendar-left');
		let cl_year_shift_r = cl_year_lr.querySelector('.calendar-right');
		cl_year_shift_l.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index,
				currentInfo.year - 1,
				currentInfo.month
			);
		});
		cl_year_shift_r.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index,
				currentInfo.year + 1,
				currentInfo.month
			);
		});
	}
	{
		let cl_month_shift_l = cl_month_lr.querySelector('.calendar-left');
		let cl_month_shift_r = cl_month_lr.querySelector('.calendar-right');
		cl_month_shift_l.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index,
				currentInfo.year,
				currentInfo.month - 1
			);
		});
		cl_month_shift_r.addEventListener('click', () => {
			setCalendarMonth(
				currentInfo.index,
				currentInfo.year,
				currentInfo.month + 1
			);
		});
	}
	
	if (!e.detail.result) {
		ctrls = [null];

		let sc_frame = document.getElementById("schedule-frame");
		
		let sc_no_room = document.createElement("div");
		sc_no_room.classList.add('schedule-no-room');
		sc_no_room.innerHTML = `
			スケジュールデータを正常に読み込めませんでした。<br />
			カレンダーはここから開けます。
		`;
		
		sc_no_room.addEventListener('click', () => {
			// カレンダーを開く
			DomHash.hash = "calendar";
			
			let dateobj = new Date();
			let year = dateobj.getFullYear();
			let month = dateobj.getMonth() + 1;
			
			setCalendarMonth(0, year, month);
			
			let date = dateobj.getDate();
			let hour = dateobj.getHours();
			cl_list.scrollLeft = width_per_hour * (hour - 2);
			cl_list.scrollTop = height_per_date * (date - 2);
		});

		sc_frame.appendChild(sc_no_room);
	}
});
