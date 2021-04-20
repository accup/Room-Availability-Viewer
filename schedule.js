/// <reference path="./overdrive.js" />
/// <reference path="./DateEx.js" />
/// <reference path="./parseTimeLine.js" />

class ScheduleController
{
	constructor (cl /*: Calendar*/)	{
		if (undefined === cl) {
			// 型推論用なら仕方ない
		}
		else {
			// DOMの構築
			{
				let sc_room = document.createElement("div");
				sc_room.classList.add('schedule-room');
				sc_room.id = cl.name;

				// current
				let sc_current = document.createElement("div");
				sc_current.classList.add('schedule-current');

				let sc_status = document.createElement("div");
				sc_status.classList.add('schedule-status');

				let sc_progress = document.createElement("div");
				sc_progress.classList.add('schedule-progress');				

				let sc_room_name = document.createElement("div");
				sc_room_name.classList.add('schedule-room-name');
				sc_room_name.textContent = cl.name;

				let sc_time = document.createElement("div");
				sc_time.classList.add('schedule-time');

				let sc_title = document.createElement("div");
				sc_title.classList.add('schedule-title');

				// next
				let sc_next = document.createElement("div");
				sc_next.classList.add('schedule-next');

				let sc_next_status = document.createElement("div");
				sc_next_status.classList.add('schedule-status');

				let sc_next_time = document.createElement("div");
				sc_next_time.classList.add('schedule-time');

				let sc_next_title = document.createElement("div");
				sc_next_title.classList.add('schedule-title');

				sc_current.appendChild(sc_progress);
				sc_current.appendChild(sc_status);
				sc_current.appendChild(sc_room_name);
				sc_current.appendChild(sc_time);
				sc_current.appendChild(sc_title);
				sc_room.appendChild(sc_current);

				sc_next.appendChild(sc_next_status);
				sc_next.appendChild(sc_next_time);
				sc_next.appendChild(sc_next_title);
				sc_room.appendChild(sc_next);

				// DOMを設定
				this.DOM = {
					sc_room: sc_room,

					sc_current: sc_current,
					sc_progress: sc_progress,
					sc_status: sc_status,
					sc_room_name: sc_room_name,
					sc_time: sc_time,
					sc_title: sc_title,

					sc_next: sc_next,
					sc_next_status: sc_next_status,
					sc_next_time: sc_next_time,
					sc_next_title: sc_next_title
				};
			}

			this.calendar = cl;

			// ありえない値で初期化
			this.currentPlan = Plan(MD(-1, -1), MD(-1, -1));
			this.currentDate = [-1, -1, -1];
			this.currentTime = -1;

			this.currentSchedule = null;
			this.currentStatus = Status(-1, -1, "");

			// 次に動きがある時間
			this.nextActionTime = 0;
			// その部屋が次使われる、または閉室するステータスを指す。なにもない場合、nullになる。
			this.nextWorkStatus = null;

			// 次の有事が近いことを確認したかどうか
			this.hasCautioned = false;
		}
	}

	update (now) {
		this.updatePlan (now);
		this.updateStatus(now);
		this.updateProgress(now);
	}

	// 月は 1 ~ 12 です。。。
	// 見つからないときは全閉室のプランが返されます。
	searchMetPlan (year, month, day) {
		let date = [year, month, day];
		// カレンダーから調べる
		let plans = this.calendar.plans;
		for (let i=0, n=plans.length; i<n; ++i) {
			let pl = plans[i];

			// overdrive.jsの配列比較で月日の包含を調べる
			// l <= r  <=>  !(r < l)  <=> !lessThan(r, l)
			if (!ArrayEx.lessThan(date, pl.begin)
				&& !ArrayEx.lessThan(pl.end, date)
			) {
				return plans[i];
			}
		}

		// 見つからないときは代わりのプランを提示する。
		let no_status = Schedule("full-closed");
		no_status.statuses.push(
			Status(
				DateEx.hms(0, 0), DateEx.hms(24, 0),
				StatusType.closed,
				"予定不明"
			)
		);
		return Plan(
			MD(date[0], date[1], date[2]),
			MD(date[0], date[1], date[2]),
			[no_status]
		);
	}

	updatePlan (now) {
		if (now instanceof Date) {
			// 現在の日を取得
			let date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

			// 日時に代わりがないのならばお帰り
			if (date[0] === this.currentDate[0]
				&& date[1] === this.currentDate[1]
				&& date[2] === this.currentDate[2]
			)
				return;
			else
				this.currentDate = date;

			// 現在のプラン内でないかどうか調べる
			if (ArrayEx.lessThan(date, this.currentPlan.begin)
				|| ArrayEx.lessThan(this.currentPlan.end, date)
			) {
				// その場合、カレンダーから改めて調べる
				this.currentPlan = this.searchMetPlan(date[0], date[1], date[2]);
			}

			// 日付が変わっているので、曜日を確認し、その曜日のスケジュールを選択する
			this.currentSchedule = this.currentPlan.schedules[now.getDay()];
		}
		else {
			throw new TypeError("Date");
		}
	}

	updateStatus (now) {
		if (now instanceof Date) {
			let second = this.currentTime = DateEx.hms(now.getHours(), now.getMinutes(), now.getSeconds());

			let statuses = this.currentSchedule.statuses;
			let n = statuses.length;

			// 次に進むべきかどうか調べる。
			if (this.nextActionTime <= second) {
				// その場合、現在のスケジュールから改めて調べる

				// ステータスを null にする
				this.currentStatus = null;
				this.hasCautioned = false;
				// カレントステータスを調べる。
				for (let i=0; i<n; ++i) {
					let st = statuses[i];

					if (st.begin <= second && second < st.end) {
						this.currentStatus = st;
						this.nextActionTime = st.end;

						// 次の利用・閉室ステータスを予告する。
						this.nextWorkStatus = null;
						for (; i<n; ++i) {
							let nx = statuses[i];
							if (st.end <= nx.begin
							 && (StatusType.used === nx.state
							 	 || StatusType.closed === nx.state)
							) {
								this.nextWorkStatus = nx;
								break;
							}
						}
						break;
					}
				}

				// 当てはまるものがない場合、ステータスには次の予定まで opened なステータスが置かれます。(つまり、カレントステータスはいつでも有効)
				if (null == this.currentStatus) {
					let st_begin = this.nextActionTime;
					let st_end = DateEx.hms(24, 0);

					// 次の利用・閉室ステータスを予告する。
					// null ネクストステータスは有効とは限らない。
					this.nextWorkStatus = null;
					for (let i=0; i<n; ++i) {
						let nx = statuses[i];

						// カレントステータスの終了
						if (second <= nx.begin) {
							st_end = this.nextActionTime = nx.begin;

							// 次の有事
							for (; i<n; ++i) {
								if (second <= nx.begin
								&& (StatusType.used === nx.state
									|| StatusType.closed === nx.state)
								) {
									this.nextWorkStatus = nx;
									break;
								}
							}
							break;
						}
					}

					this.currentStatus = Status(
						st_begin, st_end, 
						StatusType.opened, "使用可"
					);
				}

				this.updateElement();
			}
		}
		else {
			throw new TypeError("Date");
		}
	}

	updateElement () {
		let st = this.currentStatus;
		let nx = this.nextWorkStatus;

		// プログレスバーの初期化
		this.DOM.sc_progress.style.width = "0%";

		// ステータスのクラスリスト
		let status_cl = this.DOM.sc_status.classList;
		status_cl.remove('schedule-status-ok', 'schedule-status-ng', 'schedule-status-caution');
		let next_cl = this.DOM.sc_next_status.classList;
		next_cl.remove('schedule-status-ok', 'schedule-status-ng', 'schedule-status-caution');
		
		this.DOM.sc_title.textContent = st.state_text;

		switch (st.state) {
		case StatusType.used:
			// カレントステータスの設定
			this.DOM.sc_progress.style.width = `${(st.end - this.currentTime) / (st.end - st.begin)}%`;
			status_cl.add('schedule-status-ng');
		case StatusType.closed:
			let nx_begin = (null === nx) ? st.end : nx.begin;
			console.log(DateEx.h(st.end), DateEx.m(st.end), DateEx.s(st.end), DateEx.h(nx_begin), DateEx.m(nx_begin), DateEx.s(nx_begin));

			// カレントステータスの設定
			this.DOM.sc_time.textContent = `${NumberEx.toZeroPadding(DateEx.h(st.begin), 2)}:${NumberEx.toZeroPadding(DateEx.m(st.begin), 2)}　~　${NumberEx.toZeroPadding(DateEx.h(st.end), 2)}:${NumberEx.toZeroPadding(DateEx.m(st.end), 2)}`;

			// ネクストステータスの設定
			if (null === nx) {
				// 次の有事がそもそもない場合
				this.DOM.sc_next_title.textContent = "予定なし";
				this.DOM.sc_next_time.textContent = "";
				break;
			}

			// 次空くのはいつ？
			let nextSpan = nx.begin - st.end;
			// 間を空けずに(10分未満)講義が始まる -> ng
			if (nextSpan < 600000) {
				this.DOM.sc_next_status.classList.add('schedule-status-ng');
				this.DOM.sc_next_title.textContent = nx.state_text;
				this.DOM.sc_next_time.textContent = `${NumberEx.toZeroPadding(DateEx.h(nx.begin), 2)}:${NumberEx.toZeroPadding(DateEx.m(nx.begin), 2)} ~`;
			}
			// 30分未満だがすこし空く -> caution
			else if (nextSpan < 1800000) {
				this.DOM.sc_next_status.classList.add('schedule-status-caution');
				this.DOM.sc_next_title.textContent = nx.state_text;
				this.DOM.sc_next_time.textContent = `${NumberEx.toZeroPadding(DateEx.h(nx.begin), 2)}:${NumberEx.toZeroPadding(DateEx.m(nx.begin), 2)} ~`;
			}
			// 30分以上空く -> ok
			else {
				this.DOM.sc_next_status.classList.add('schedule-status-ok');
				this.DOM.sc_next_title.textContent = "使用可";
				this.DOM.sc_next_time.textContent = `~ ${NumberEx.toZeroPadding(DateEx.h(nx.begin), 2)}:${NumberEx.toZeroPadding(DateEx.m(nx.begin), 2)}`;
			}
			break;
		case StatusType.opened:
			{
				let nextWorkTime = (null === this.nextWorkStatus) ? this.currentStatus.end : this.nextWorkStatus.begin;
				// カレント (ry
				let nextSpan = nextWorkTime - this.currentTime;
				if (nextSpan < 1800000) {
					status_cl.add('schedule-status-caution');
					this.DOM.sc_progress.style.width = `${nextSpan / 1800000}%`;					
				}
				else
					status_cl.add('schedule-status-ok');
				this.DOM.sc_time.textContent = `　~　${NumberEx.toZeroPadding(DateEx.h(nextWorkTime), 2)}:${NumberEx.toZeroPadding(DateEx.m(nextWorkTime), 2)}`;
			}

			// ネクスト (ry
			if (null === nx) {
				this.DOM.sc_next_title.textContent = "予定なし";
				this.DOM.sc_next_time.textContent = "~ 24:00";
				break;
			}

			this.DOM.sc_next_title.textContent = nx.state_text;
			this.DOM.sc_next_time.textContent = `~ ${NumberEx.toZeroPadding(DateEx.h(nx.end), 2)}:${NumberEx.toZeroPadding(DateEx.m(nx.end), 2)}`;
			break;
		}
	}

	updateProgress (now) {
		if (now instanceof Date) {
			let second = DateEx.hms(now.getHours(), now.getMinutes(), now.getSeconds());

			let nextWorkTime = (null === this.nextWorkStatus) ? this.currentStatus.end : this.nextWorkStatus.begin;

			switch (this.currentStatus.state) {
			case StatusType.used:
				{
					let span = nextWorkTime - this.currentStatus.begin;
					if (0 !== span) {
						let ratio = (second - this.currentStatus.begin) * 100 / span;
						this.DOM.sc_progress.style.width = `${ratio}%`;
					}
				}
				break;
			case StatusType.opened:
				{
					let rest = nextWorkTime - second;
					if (rest <= 3600000)
					{
						if (rest <= 1800000 && !this.hasCautioned) {
							this.DOM.sc_status.classList.remove('schedule-status-ok', 'schedule-status-ng');
							this.DOM.sc_status.classList.add('schedule-status-caution');
							this.DOM.sc_title.textContent = "少しの間利用可";
							this.hasCautioned = true;
						}

						let ratio = (3600000 - rest) * 100 / 3600000;
						this.DOM.sc_progress.style.width = `${ratio}%`;
					}
				}
				break;
			default:
				break;
			}
		}
		else {
			throw new TypeError("Date");
		}
	}

	get rootElement () {
		return this.DOM.sc_room;
	}
};

var getControllers = function () {
	return null;
};

void function () {
	var controllers = [new ScheduleController()];
	controllers.pop();

	// イベントリスナーで初期化されるので、
	// getControllersを使うときは
	// window.addEventListenet('load')の中で使うこと。
	window.addEventListener('load',  () => {
		fetch("timeline.tl")
		.then(r => r.text())
		.then(text => {
			try {
				return parseTimeLine(text);
			}
			catch (e) {
				console.error(e);
				throw e;
			}
		})
		.then(timeline => {
			let tl_versions = document.querySelectorAll('.timeline-version');
			for (let i=0, n=tl_versions.length; i<n; ++i) {
				tl_versions[i].textContent = timeline.version;
			}

			let calendars = timeline.calendars;

			let sc_frame = document.getElementById("schedule-frame");

			for (let i=0, n=calendars.length; i<n; ++i) {
				controllers.push(new ScheduleController(calendars[i]));
				controllers[i].update(new Date());
				sc_frame.appendChild(controllers[i].rootElement);
			}

			let event = new CustomEvent ("load-schedules", {
				cancelable: true,
				detail: {
					result: true
				}
			});
			window.dispatchEvent(event);
		}, e => {
			let event = new CustomEvent ("load-schedules", {
				cancelable: true,
				detail: {
					result: false
				}
			});
			window.dispatchEvent(event);
		});
	});

	getControllers =  function () {
		return controllers;
	}
} ();