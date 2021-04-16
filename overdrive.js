// NumberEx
var NumberEx = {
	toZeroPadding (number, digits) {
		return ("0000000000000000" + number).slice(-digits);
	}
};

// ArrayEx
var ArrayEx = {
	lessThan (l, r) {
		if (r instanceof Array) {
			let l1 = l.length;
			let l2 = r.length;

			for (let i=0, n=(l1<l2)?l1:l2; i<n; ++i) {
				if (l[i] === r[i])
					continue;
				else
					return (l[i] < r[i]);
			}
			return l1 < l2;
		}
		else {
			return (0 === l.length) || l[0] < r;
		}
	}
};
