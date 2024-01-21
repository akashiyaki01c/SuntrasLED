async function getDestData(name) {
	async function getDestCSV() {
		return await (await fetch(`./data/${name}.csv`)).text();
	}
	const result = [];

	const rows = (await getDestCSV()).split("\n");
	for (let i = 0; i < rows.length; i++) {
		const columns = rows[i].split(",");
		for (let j = 0; j < columns.length; j++) {
			const cell = columns[j];
			result.push({
				name: cell,
				y: i,
				x: j,
			});
		}
	}
	return result.sort((a, b) => {
		if (a.x != b.x) {
			return a.x - b.x;
		}
		return a.y - b.y;
	})
}

async function initLed(name, width) {
	const dest = new LedDisplay(name, `./images/${name}.png`, 16 * width, 16, 0, 0, 5);
	let str = "";
	for (const v of await getDestData(name)) {
		if (v.name == "") 
			continue;
		str += `<option value="${v.x},${v.y}">${v.name}</option>`;
	}
	document.querySelector(`#${name}-select`).innerHTML = str;
	document.querySelector(`#${name}-select`).onchange = () => {
		const value = document.querySelector(`#${name}-select`).value.split(",").map(v => Number(v));
		dest.update(value[0] * 2, value[1]);
		document.querySelector("main").dataset.lang = "ja";
	};
	return dest;
}