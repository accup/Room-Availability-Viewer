{
	let hash = "";

	var DomHash = {
		get hash () {
			return hash;
		},
		set hash (value) {
			if ("" !== hash) {
				let old = document.getElementById(hash);
				if (null != old) {
					old.classList.remove('dom-hash-target');
				}
			}

			let id = value.toString();
			if ("" === id) {
				hash = id;
				return;
			}

			let elm = document.getElementById(id);
			if (null == elm) {
				hash = "";
				throw new Error(`id="${id}"である要素は存在しません。`);
			}
			else {
				hash = id;
				elm.classList.add('dom-hash-target');
			}
		}
	};
}

window.addEventListener('load', () => {
});