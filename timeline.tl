# スケジュール
version "デモンストレーション用";

setyear 2021;

schedule {
	full-closed {
		      ~      , closed, "閉室";
	}
	festival {
		      ~      , closed, "文化祭";
	}
}

"A室" {
	schedule {
		normal-mon {
			      ~  9:00, closed, "閉室";
			13:10 ~ 14:40,   used, "国語";
			14:50 ~ 18:00,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
		normal-tue {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "社会";
			14:50 ~ 16:20,   used, "総合";
			16:30 ~ 19:30,   used, "算数";
			20:50 ~      , closed, "閉室";
		}
		normal-wed {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "社会";
			10:40 ~ 12:10,   used, "音楽";
			13:10 ~ 14:40,   used, "英語";
			14:50 ~ 16:20,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
		normal-thu {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "算数";
			13:10 ~ 14:40,   used, "国語";
			14:50 ~ 16:20,   used, "家庭科";
			20:50 ~      , closed, "閉室";
		}
		normal-fri {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "技術";
			13:10 ~ 18:00,   used, "書道";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};

}

"B室" {
	schedule {
		normal-mon {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "英語";
			13:40 ~ 14:40,   used, "算数";
			20:50 ~      , closed, "閉室";
		}
		normal-tue {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "国語";
			10:40 ~ 12:40,   used, "道徳";
			16:30 ~ 19:30,   used, "技術";
			20:50 ~      , closed, "閉室";
		}
		normal-wed {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "社会";
			13:40 ~ 14:40,   used, "理科";
			14:50 ~ 18:00,   used, "音楽";
			20:50 ~      , closed, "閉室";
		}
		normal-thu {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:40,   used, "算数";
			14:50 ~ 16:20,   used, "国語";
			20:50 ~      , closed, "閉室";
		}
		normal-fri {
			      ~  9:00, closed, "閉室";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
}

"C室" {
	schedule {
		normal-mon {
			      ~  9:00, closed, "閉室";
			20:50 ~      , closed, "閉室";
		}
		normal-tue {
			      ~  9:00, closed, "閉室";
			20:50 ~      , closed, "閉室";
		}
		normal-wed {
			      ~  9:00, closed, "閉室";
			13:40 ~ 18:00,   used, "家庭科";
			20:50 ~      , closed, "閉室";
		}
		normal-thu {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 16:20,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
		normal-fri {
			      ~  9:00, closed, "閉室";
			16:30 ~ 18:00,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
}

"D1室" {
	schedule {
		normal-mon {
			      ~  9:00, closed, "閉室";
			13:10 ~ 15:40,   used, "英語";
			16:30 ~ 18:00,   used, "国語";
			20:50 ~      , closed, "閉室";
		}
		normal-tue {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "技術";
			10:40 ~ 12:10,   used, "理科";
			13:10 ~ 16:20,   used, "社会";
			20:50 ~      , closed, "閉室";
		}
		normal-wed {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "社会";
			13:10 ~ 15:35,   used, "英語";
			20:50 ~      , closed, "閉室";
		}
		normal-thu {
			      ~  9:00, closed, "閉室";
			10:40 ~ 16:20,   used, "算数";
			16:30 ~ 18:00,   used, "社会";
			20:50 ~      , closed, "閉室";
		}
		normal-fri {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 12:20,   used, "国語";
			13:10 ~ 15:35,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
}

"D2室" {
	schedule {
		normal-mon {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "算数";
			13:10 ~ 14:40,   used, "技術";
			16:30 ~ 18:00,   used, "総合";
			20:50 ~      , closed, "閉室";
		}
		normal-tue {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "家庭科";
			20:50 ~      , closed, "閉室";
		}
		normal-wed {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "英語";
			15:35 ~ 18:00,   used, "理科";
			20:50 ~      , closed, "閉室";
		}
		normal-thu {
			      ~  9:00, closed, "閉室";
			10:40 ~ 12:10,   used, "技術";
			20:50 ~      , closed, "閉室";
		}
		normal-fri {
			      ~  9:00, closed, "閉室";
			 9:00 ~ 10:30,   used, "国語";
			15:35 ~ 18:00,   used, "書道";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal-mon;
		Tue, normal-tue;
		Wed, normal-wed;
		Thu, normal-thu;
		Fri, normal-fri;
		Sat, full-closed;
	};
}

自由使用室 {
	schedule {
		normal {
			      ~  9:00, closed, "閉室";
			20:50 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, normal;
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, normal;
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
}

窓口 {
	schedule {
		normal {
			      ~  8:45, closed, "閉室";
			12:45 ~ 13:45, closed, "閉室";
			17:00 ~      , closed, "閉室";
		}
	}

	 1/30 ~ 7/20, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	 7/21 ~  8/31, full-closed;
	 9/ 1 ~ 11/16, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	11/17 ~ 11/20, festival;
	11/21 ~ 12/20, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
	12/21, full-closed;
	12/22, normal;
	12/23 ~ 12/31, full-closed;

	setyear next;

	 1/ 1 ~  1/ 9, full-closed;
	 1/10 ~  1/11, normal;
	 1/12 ~  1/14, full-closed;
	 1/15 ~  1/29, {
		Sun, full-closed;
		Mon, normal;
		Tue, normal;
		Wed, normal;
		Thu, normal;
		Fri, normal;
		Sat, full-closed;
	};
}
