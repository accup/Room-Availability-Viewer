var DateEx = {
	now: Date.now,
	// 時分秒をミリ秒に直す
	hms(h, m, s) {
		h = h || 0;
		m = m || 0;
		s = s || 0;
		return h * 3600000 + m*60000 + s * 1000;
	},

	// ミリ秒から時を得る
	h(hms) {
		return Math.floor(hms / 3600000);
	},
	// ミリ秒から分を得る
	m(hms) {
		return Math.floor(hms / 60000) % 60;
	},
	// ミリ秒から秒を得る
	s(hms) {
		return Math.floor(hms / 1000) % 60;
	},

	// 指定した年月日時分秒のDateオブジェクトを返す。
	// 全て省略すると、紀元元年1月1日0時0分0秒0を返す。
	// 年は元年が1、月は1~12、日は1~31で指定する。
	YMDhms(Y, M, D, h, m, s) {
		Y = (undefined === Y) ? 1 : Y;
		M = (undefined === M) ? 0 : M - 1;
		let date = new Date(0, 0, 0, h, m, s);
		date.setFullYear(Y, M, D);
		return date;
	},

	// その日が第何週なのか調べる
	getWeek (D) {
		return Math.floor((D - 1) / 7) + 1;
	},

	// 休日を調べる
	isHoliday (Y, M, D, d) {
		if (undefined === d)
			d = DateEx.YMDhms(Y, M, D).getDay();
		return "" !== DateEx.getHolidayName(Y, M, D, d);
	},
	// 休日名を調べる
	getHolidayName (Y, M, D, d) {
		if (undefined === d)
			d = DateEx.YMDhms(Y, M, D).getDay();

		let national = DateEx.getNationalHolidayName(Y, M, D, d);
		if ("" === national) {
			let before = DateEx.YMDhms(Y, M, D-1);
			if (DateEx.isNationalHoliday(
				before.getFullYear(),
				before.getMonth() + 1,
				before.getDate(),
				before.getDay()
			)) {
				// 挟まれた休日 (1985/12/27 ~ )
				if (1986 <= Y
					|| (1985 === Y && 12 <= M && 27 <= D)
				){
					let after = DateEx.YMDhms(Y, M, D+1);
					if (DateEx.isNationalHoliday(
						after.getFullYear(),
						after.getMonth() + 1,
						after.getDate(),
						after.getDay()
					))
						return "国民の休日";
				}                    
				// 振替休日 (1973/04/12 ~ )
				if (1974 <= Y
					|| (1973 === Y && (5 <= M || (4 === M && 12 <= D)))
				){
					Y = before.getFullYear();
					M = before.getMonth() + 1;
					D = before.getDate();
					d = before.getDay();

					// 改正前
					if (Y <= 2006) {
						if (0 === d)
							return "振替休日";
					}
					// 改正後
					else {
						do {
							if (0 === d)
								return "振替休日";
		
							before = DateEx.YMDhms(Y, M, D-1);
							Y = before.getFullYear();
							M = before.getMonth() + 1;
							D = before.getDate();
							d = before.getDay();
						} while (DateEx.isNationalHoliday(Y, M, D, d));
					}
				}
			}

			return "";
		}
		else
			return national;
	},
	// 国民の祝日を調べる
	isNationalHoliday (Y, M, D, d) {
		if (undefined === d)
			d = DateEx.YMDhms(Y, M, D).getDay();
		return "" !== DateEx.getNationalHolidayName(Y, M, D, d);
	},
	// 国民の祝日名を調べる
	getNationalHolidayName (Y, M, D, d) {
		if (undefined === d)
			d = DateEx.YMDhms(Y, M, D).getDay();

		let w = DateEx.getWeek(D);

		if (Y <= 1872) {
			// 不明・準備中・旧暦とかでややこしい
			return "";
		}
		if (1873 == Y) {
			// 年中祭日祝日ノ休暇日ヲ定ム (1873/10/14 ~ 1912/09/03)
			if (11 === M && 3 === D) return "天長節";
			if (11 === M && 23 === D) return "新嘗祭";
		}
		// 年中祭日祝日ノ休暇日ヲ定ム (1873/10/14 ~ 1912/09/03)
		else if (Y <= 1911) {
			if (1 === M && 3 === D) return "元始祭";
			if (1 === M && 5 === D) return "新年宴会";
			if (1 === M && 30 === D) return "先帝祭（孝明天皇祭）";
			if (2 === M && 11 === D) return "紀元節";
			if (4 === M && 3 === D) return "神武天皇祭";

			if (Y <= 1878 && 9 === M && 17 === D) return "神嘗祭";
			if (1879 <= Y && 10 === M && 17 === D) return "神嘗祭";
			if (11 === M && 3 === D) return "天長節";
			if (11 === M && 23 === D) return "新嘗祭";

			let equinox = DateEx.EquinoxDays[Y];
			if (equinox) {
				if (equinox[0][0] === Y && equinox[0][1] === M) return "春季皇霊祭";
				if (equinox[1][0] === Y && equinox[1][1] === M) return "秋季皇霊祭";
			}
		}
		else if (1912 === Y) {
			if (1 === M && 3 === D) return "元始祭";
			if (1 === M && 5 === D) return "新年宴会";
			if (1 === M && 30 === D) return "先帝祭（孝明天皇祭）";
			if (2 === M && 11 === D) return "紀元節";
			if (4 === M && 3 === D) return "神武天皇祭";

			// 休日ニ関スル件 (1912/09/04 ~ 1948/07/20)
			if (10 === M && 17 === D) return "神嘗祭";
			if (11 === M && 23 === D) return "新嘗祭";

			let equinox = DateEx.EquinoxDays[Y];
			if (equinox) {
				if (equinox[0][0] === Y && equinox[0][1] === M) return "春季皇霊祭";
				if (equinox[1][0] === Y && equinox[1][1] === M) return "秋季皇霊祭";
			}
		}
		// 休日ニ関スル件 (1912/09/04 ~ 1948/07/20)
		else if (Y <= 1947) {
			if (1 === M && 3 === D) return "元始祭";
			if (1 === M && 5 === D) return "新年宴会";
			if (2 === M && 11 === D) return "紀元節";
			if (Y <= 1926) {
				if (4 === M && 3 === D) return "神武天皇祭";
				if (7 === M && 30 === D) return "先帝祭（明治天皇祭）";
				if (8 === M && 31 === D) return "天長節";
				if (10 === M && 17 === D) return "神嘗祭";
				if (10 === M && 31 === D) return "天長節祝日";
				if (11 === M && 23 === D) return "新嘗祭";
			}
			else {
				if (4 === M && 3 === D) return "神武天皇祭";
				if (8 === M && 31 === D) return "天長節";
				if (10 === M && 17 === D) return "神嘗祭";
				if (11 === M && 3 === D) return "明治節";
				if (11 === M && 23 === D) return "新嘗祭";
				if (12 === M && 25 === D) return "先帝祭（大正天皇祭）";
			}

			let equinox = DateEx.EquinoxDays[Y];
			if (equinox) {
				if (equinox[0][0] === Y && equinox[0][1] === M) return "春季皇霊祭";
				if (equinox[1][0] === Y && equinox[1][1] === M) return "秋季皇霊祭";
			}
		}
		else if (1948 === Y) {
			if (1 === M && 3 === D) return "元始祭";
			if (1 === M && 5 === D) return "新年宴会";
			if (2 === M && 11 === D) return "紀元節";
			if (4 === M && 3 === D) return "神武天皇祭";

			// 国民の祝日に関する法律 (1948/07/20 ~ 現行法)
		}
		// 国民の祝日に関する法律 (1948/07/20 ~ 現行法)
		else {
			if (1 === M && 1 === D) return "元日";

			if (Y <= 1999 && 1 === M && 15 === D) return "成人の日";
			if (2000 <= Y && 1 === M && 1 === d && 2 === w) return "成人の日";

			if (1967 <= Y && 2 === M && 11 === D) return "建国記念の日";

			if (4 === M && 29 === D) {
				if (Y <= 1988) return "天皇誕生日";
				if (Y <= 2006) return "みどりの日";
				return "昭和の日";
			}

			if (5 === M && 3 === D) return "憲法記念日";
			if (2007 <= Y && 5 === M && 4 === D) return "みどりの日";
			if (5 === M && 5 === D) return "こどもの日";

			if (1996 <= Y && Y <= 2002 && 7 === M && 20 === D) return "海の日";
			if (2003 <= Y && 2020 !== Y && 2021 !== Y && 7 === M && 1 === d && 3 === w) return "海の日";
			// 令和三年東京オリンピック競技大会・東京パラリンピック競技大会特別措置法
			if (2020 === Y && 7 === M && 23 === D) return "海の日";
			if (2021 === Y && 7 === M && 22 === D) return "海の日";

			if (2016 <= Y && 2020 !== Y && 2021 !== Y && 8 === M && 11 === D) return "山の日";
			// 令和三年東京オリンピック競技大会・東京パラリンピック競技大会特別措置法
			if (2020 === Y && 8 === M && 10 === D) return "山の日";
			if (2021 === Y && 8 === M && 8 === D) return "山の日";

			if (Y <= 2002 && 9 === M && 15 === D) return "敬老の日";
			if (2003 <= Y && 9 === M && 1 === d && 3 === w) return "敬老の日";

			if (1966 <= Y && Y <= 2019 && 10 === M && 1 === d && 2 === w) return "体育の日";
			// 国民の祝日に関する法律の一部を改正する法律 (2020/01/01 ~)
			if (2020 <= Y && 2020 !== Y && 2021 !== Y && 10 === M && 1 === d && 2 === w) return "スポーツの日";
			// 令和三年東京オリンピック競技大会・東京パラリンピック競技大会特別措置法
			if (2020 === Y && 7 === M && 24 === D) return "スポーツの日";
			if (2021 === Y && 7 === M && 23 === D) return "スポーツの日";

			if (11 === M && 3 === D) return "文化の日";
			if (11 === M && 23 === D) return "勤労感謝の日";
			if (1989 <= Y && 12 === M && 23 === D) return "天皇誕生日";
		
			let equinox = DateEx.EquinoxDays[Y];
			if (equinox) {
				if (equinox[0][0] === M && equinox[0][1] === D) return "春分の日";
				if (equinox[1][0] === M && equinox[1][1] === D) return "秋分の日";
			}
		}
		return "";
	},

	// 春分・秋分日
	EquinoxDays: {
		2000: [[3, 20], [9, 23]],
		2001: [[3, 20], [9, 23]],
		2002: [[3, 21], [9, 23]],
		2003: [[3, 21], [9, 23]],
		2004: [[3, 20], [9, 23]],
		2005: [[3, 20], [9, 23]],
		2006: [[3, 21], [9, 23]],
		2007: [[3, 21], [9, 23]],
		2008: [[3, 20], [9, 23]],
		2009: [[3, 20], [9, 23]],
		2010: [[3, 21], [9, 23]],
		2011: [[3, 21], [9, 23]],
		2012: [[3, 20], [9, 22]],
		2013: [[3, 20], [9, 23]],
		2014: [[3, 21], [9, 23]],
		2015: [[3, 21], [9, 23]],
		2016: [[3, 20], [9, 22]],
		2017: [[3, 20], [9, 23]],
		2018: [[3, 21], [9, 23]],
		2019: [[3, 21], [9, 23]],
		2020: [[3, 20], [9, 22]],
		2021: [[3, 20], [9, 23]],
		2022: [[3, 21], [9, 23]],
		2023: [[3, 21], [9, 23]],
		2024: [[3, 20], [9, 22]],
		2025: [[3, 20], [9, 23]],
		2026: [[3, 20], [9, 23]],
		2027: [[3, 21], [9, 23]],
		2028: [[3, 20], [9, 22]],
		2029: [[3, 20], [9, 23]],
		2030: [[3, 20], [9, 23]]
	}
};