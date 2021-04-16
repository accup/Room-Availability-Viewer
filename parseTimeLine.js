/// <reference path="./DateEx.js" />
{
	function MD (Y, M, D) {
		return [+Y, +M, +D];
	}
	var type_safe = {
		number(value) {
			if ('number' === typeof value)
				return value;
			else
				throw new TypeError("number");
		},
		string(value) {
			if ('string' === typeof value)
				return value;
			else
				throw new TypeError("string");
		},
		object(value) {
			if ('object' === typeof value)
				return value;
			else
				throw new TypeError("object");
		},
		MD(value) {
			if (value instanceof Array && 3 == value.length)
				return MD(value[0], value[1], value[2]);
			else
				throw new TypeError("MD");
		}
	};
	let IStream = class {
		constructor(text) {
			if ('string' === typeof text)
				this.text = text;
			else
				this.text = "\0";
			this.index = 1;
			this.stack = [this.text[0]];
		}

		take() {
			if (0 < this.stack.length)
				return this.stack.pop();
			else
				return this.text[this.index++];
		}

		keep(c) {
			if ('string' === typeof c) {
				this.stack.push(c);
				return c;
			}
			else {
				return "\0";
			}
		}

		look() {
			return this.keep(this.take());
		}
	};
	let Token = class {
		constructor (type, value) {
			if ('string' === typeof type)
				this.type = type;
			else
				this.type = "null";

			this.value = value;
		}
	};
	let Kind = {
		blank:  /[\s\0]/,
		number: /[0-9]/,
		symbol: /[+*/%{}~:;,]/,
		string: /"/,
		comment:/#/
	};
	let Lexer = class {
		constructor (istream) {
			if (istream instanceof IStream)
				this.istream = istream;
			else if ('string' === typeof istream)
				this.istream = new IStream(istream);
			else
				this.istream = new IStream();

			(this.stack = [new Token()]).pop();
		}

		take() {
			if (0 < this.stack.length)
				return this.stack.pop();
			else
				return this.blank();
		}

		keep(token) {
			if (token instanceof Token) {
				let t = new Token(token.type, token.value);
				this.stack.push(t);
				return t;
			}
			else
				new Token("eof");
		}

		look() {
			return this.keep(this.take());
		}

		blank() {
			let c = this.istream.look();
			while(
				Kind.blank.test(c)
				|| Kind.comment.test(c)
			) {
				this.istream.take();
				if (Kind.comment.test(c))
					this.comment();	// コメントを読み飛ばす
				else if ("\0" === c)
					return new Token("eof");

				c = this.istream.look();
			}

			return this.native();
		}
		comment() {
			this.istream.take();
			let carriage = false;
			let newline = false;
			while(!newline) {
				let c = this.istream.look();
				if ("\r" === c) {
					carriage = true;
					this.istream.take();
				}
				else if ("\n" === c) {
					newline = true;
					this.istream.take();
				}
				else if (carriage) {
					newline = true;
				}
				else {
					this.istream.take();
				}
			}
		}

		native() {
			let c = this.istream.look();
			return  Kind.number.test(c) ? this.number()
				:   Kind.symbol.test(c) ? this.symbol()
				:   Kind.string.test(c) ? this.string()
										: this.identifier();
		}

		number() {
			let num = "";
			while(Kind.number.test(this.istream.look())) {
				num += this.istream.take();
			}
			return new Token("number", num);
		}
		symbol() {
			return new Token("symbol", this.istream.take());
		}
		string() {
			this.istream.take();
			let str = "";
			while(!Kind.string.test(this.istream.look())) {
				str += this.istream.take();
			}
			this.istream.take();
			return new Token("string", str);
		}
		identifier() {
			let id = "";
			let c = this.istream.look();
			while(!(
				Kind.blank.test(c)
				|| Kind.symbol.test(c)
				|| Kind.string.test(c)
				|| Kind.comment.test(c)
			)) {
				id += this.istream.take();
				c = this.istream.look();
			}

			return new Token("identifier", id);
		}
	};
	var StatusType = {
		closed:	"closed",
		opened:	"opened",
		used:	"used",
		unknown: "unknown"
	};
	function Status (begin, end, state, state_text) {
		return {
			begin: type_safe.number(begin),
			end: type_safe.number(end),
			state: type_safe.string(state),
			state_text: (state_text) ? type_safe.string(state_text) : state
		};
	}
	function Schedule (name) {
		let statuses = [Status(0, 0, "", "")];
		statuses.pop();

		return {
			name: type_safe.string(name),
			statuses: statuses
		}
	}
	function Plan (begin, end, schedules) {
		// schedules は7つの要素を持つ配列。それぞれ
		//	日～土に対応する。
		// もし足りない場合は、最後のスケジュールで埋められる。
		let _schedules = [Schedule("")];
		_schedules.pop();
		if (schedules instanceof Array) {
			let lastSchedule = Schedule("");
			for (let i=0, n=schedules.length; i<7; ++i) {
				if (i<n) {
					_schedules.push(schedules[i]);
					lastSchedule = schedules[i];
				}
				else {
					_schedules.push(lastSchedule);
				}
			}
		}
		return {
			begin: type_safe.MD(begin),
			end: type_safe.MD(end),
			schedules: _schedules
		};
	}
	function Calendar (name, plans) {
		let _plans = [Plan(MD(0, 0, 0), MD(0, 0, 0))];
		_plans.pop();
		if (plans instanceof Array) {
			for (let i=0, n=plans.length; i<n; ++i) {
				_plans.push(plans[i]);
			}
		}
		return {
			name: type_safe.string(name),
			plans: _plans
		};	
	}
	function TimeLine (version, calendars) {
		let _calendars = [Calendar("")];
		_calendars.pop();
		if (calendars instanceof Array) {
			for (let i=0, n=calendars.length; i<n; ++i) {
				_calendars.push(calendars[i]);
			}
		}
		return {
			version: version,
			calendars: _calendars
		};
	}
	let Evaluator = class {
		constructor() {
			let schedules = [Schedule("")];
			schedules.pop();
			this.scheduless	= [schedules];
			(this.calendars = [Calendar("", [])]).pop();
		}

		get schedules () {
			return this.scheduless[this.scheduless.length - 1];
		}
		pushSchedule() {
			this.scheduless.push([]);
		}
		popSchedule() {
			if (1 < this.scheduless.length)
				this.scheduless.pop();
		}
		searchSchedule(name) {
			for (let i=0, n=this.scheduless.length; i<n; ++i) {
				for (let j=0, m=this.scheduless[i].length; j<m; ++j) {
					if (name === this.scheduless[i][j].name)
						return this.scheduless[i][j];
				}
			}
			return null;
		}
	};
	let EOF = class extends Error {
		constructor() {
			super("End Of File");
		}
	};
	let CompileError = class extends Error {
		constructor (message) {
			super(message);
		}
	}
	var Parser = class {
		constructor (lexer) {
			if (lexer instanceof Lexer)
				this.lexer = lexer;
			else if ('string' === typeof lexer)
				this.lexer = new Lexer(lexer);
			else
				this.lexer = new Lexer();

			this.year = [new Date().getFullYear()];
			this.year.push(this.year[0]);

			this.tl_version = "(Unknown)";
		}
		error() {
			throw new CompileError("Unexpected error");
		}
		next() {
			let token = this.lexer.look();
			if ("eof" === token.type)
				throw new EOF();
			else
				return token;
		}
		test(type, value) {
			if (undefined === value) {
				if (undefined === type)
					return true;
				else
					return this.next().type === type;
			}
			else {
				let token = this.next();
				return token.type === type && token.value == value;
			}
		}
		eat(type, value) {
			if (this.test(type, value))
				return this.lexer.take();
			else
				throw new CompileError(`Unmatched token ${this.next().type}, ${this.next().value} with ${type}, ${value}`);
		}

		// root grammer
		definitions () {
			let evaluator = new Evaluator();
			try {
				for(let i=0; i<100; ++i) {
					this.definition(evaluator);
				}
			}
			catch (e) {
				if (e instanceof EOF) {
					// no statement
				}
				else
					throw e;
			}

			return TimeLine(this.tl_version, evaluator.calendars);
		}

		definition(evaluator) {
			if (evaluator instanceof Evaluator) {
				if (this.test('identifier', "setyear")) {
					this.setyear();
				}
				else if (this.test('identifier', "version")) {
					this.version();
				}
				else if (this.test('identifier', "schedule")) {
					this.eat('identifier', "schedule");
					this.eat('symbol', "{");
					this.schedules(evaluator.schedules);
					this.eat('symbol', "}");
				}
				else {
					let tlname = (this.test('identifier')) ? this.eat('identifier').value : this.eat('string').value;

					this.eat('symbol', "{");
				
					evaluator.pushSchedule();
					this.year.push(this.year[0]);
					let plans = this.statements(evaluator);
					this.year.pop();
					evaluator.popSchedule();

					evaluator.calendars.push(Calendar(tlname, plans));

					this.eat('symbol', "}");
				}
			}
			else
				this.error();
		}

		setyear () {
			this.eat('identifier', "setyear");

			if (this.test('identifier', "next")) {
				this.eat('identifier', "next");
				++this.year[this.year.length - 1];
			}
			else if (this.test('identifier', "previous")) {
				this.eat('identifier', "previous");
				--this.year[this.year.length - 1];
			}
			else {
				this.year[this.year.length - 1] = parseInt(this.eat('number').value);
			}
			this.eat('symbol', ";");
		}

		version () {
			this.eat('identifier', "version");

			let version = "";
			while (!this.test('symbol', ";")) {
				version += this.eat().value;
			}
			this.eat('symbol', ";");

			this.tl_version = version;
		}

		schedules(schedules) {
			while(!this.test('symbol', "}")) {
				schedules.push(this.schedule());
			}
		}
		schedule() {
			let scname = this.eat('identifier').value;
			let schedule = Schedule(scname);

			this.eat('symbol', "{");
			this.statuses(schedule);
			this.eat('symbol', "}");

			return schedule;
		}
		statuses(schedule) {
			this.status_begin_time = 0;

			while(!this.test('symbol', "}")) {
				schedule.statuses.push(this.status());
			}
		}
		status() {
			let begin_time, end_time;
			{
				if (this.test('symbol', "~")) {
					begin_time = this.status_begin_time;
				}
				else {
					let h = this.eat('number');
					this.eat('symbol', ":");
					let m = this.eat('number');
					begin_time = DateEx.hms(h.value, m.value);
				}

				this.eat('symbol', "~");

				if (this.test('symbol', ",")) {
					end_time = DateEx.hms(24, 0);
				}
				else {
					let h = this.eat('number');
					this.eat('symbol', ":");
					let m = this.eat('number');
					end_time = DateEx.hms(h.value, m.value);
				}
			}

			// 終了時間は、次回の開始時間を省略した場合の時間となる。
			this.status_begin_time = end_time;

			this.eat('symbol', ",");

			let state = this.eat('identifier').value;

			this.eat('symbol', ",");

			let state_text = this.eat('string').value;

			this.eat('symbol', ";");

			return Status(begin_time, end_time, state, state_text);
		}

		statements(evaluator) {
			if (evaluator instanceof Evaluator) {
				let plans = [];

				while (!this.test('symbol', "}")) {
					if (this.test('identifier', "setyear")
						|| this.test('identifier', "schedule")
					)
						this.definition(evaluator);
					else
						plans.push(this.plan(evaluator));
				}

				return plans;
			}
			else
				this.error();
		}
		plan(evaluator) {
			if (evaluator instanceof Evaluator) {
				let begin_date;
				{
					let M = parseInt(this.eat('number').value);
					this.eat('symbol', "/");
					let D = parseInt(this.eat('number').value);
					begin_date = MD(this.year[this.year.length - 1], M, D);
				}

				let end_date;
				if (this.test('symbol', "~")) {
					this.eat('symbol', "~");

					let M = parseInt(this.eat('number').value);
					this.eat('symbol', "/");
					let D = parseInt(this.eat('number').value);
					end_date = MD(this.year[this.year.length - 1], M, D);
				}
				else
					end_date = begin_date;

				this.eat('symbol', ",");

				if (this.test('identifier')) {
					let scname = this.eat('identifier').value;

					let sc = evaluator.searchSchedule(scname);

					this.eat('symbol', ";");
					
					if (null === sc)
						throw new CompileError(`Unbound schedule name ${scname}`);
					else
						return Plan(begin_date, end_date, [sc]);
				}
				else if (this.test('symbol', "{")) {
					this.eat('symbol', "{");


					let scs = [null, null, null, null, null, null, null];

					let index = 0;
					while (!this.test('symbol', "}")) {
						let dayname = (this.test('identifier')) ? this.eat('identifier').value : this.eat('number').value;

						let isValidDayName = true;
						switch (dayname) {
							case "Sun":
							case "SUN":
							case "sun":
							case "Sunday":
							case "日":
							case "0":
								index = 0;
								break;
							case "Mon":
							case "MON":
							case "mon":
							case "Monday":
							case "月":
							case "1":
								index = 1;
								break;
							case "Tue":
							case "TUE":
							case "tue":
							case "Tuesday":
							case "火":
							case "2":
								index = 2;
								break;
							case "Wed":
							case "WED":
							case "wed":
							case "Wednesday":
							case "水":
							case "3":
								index = 3;
								break;
							case "Thu":
							case "THU":
							case "thu":
							case "Thursday":
							case "木":
							case "4":
								index = 4;
								break;
							case "Fri":
							case "FRI":
							case "fri":
							case "Friday":
							case "金":
							case "5":
								index = 5;
								break;
							case "Sat":
							case "SAT":
							case "sat":
							case "Saturday":
							case "土":
							case "6":
								index = 6;
								break;
							default:
								isValidDayName = false;
								break;
						}

						let scname;
						if (isValidDayName) {
							this.eat('symbol', ",");
							scname = this.eat('identifier').value;
						}
						else {
							scname = dayname;
						}

						let sc = evaluator.searchSchedule(scname);

						this.eat('symbol', ";");

						if (null === sc)
							throw new CompileError(`Unbound schedule name ${scname}`);
						else
							scs[index] = sc;

						// 曜日を指定しない場合、最後に選択した曜日からループする形で割り当てられる。
						index = (++index % 7);
					}

					this.eat('symbol', "}");

					// ここは省略してもよい。
					if (this.test('symbol', ";"))
						this.eat('symbol', ";");
					
					return Plan(begin_date, end_date, scs);
				}
				else
					throw new CompileError("An identifier or symbol '{' is expected.");
			}
			else
				this.error();
		}
	};

	// converting TimeLine data (.tl)
	function parseTimeLine(text) {
		let parser = new Parser(text);
		return parser.definitions();			
	}
}