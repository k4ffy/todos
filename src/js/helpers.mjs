// Заменяет символы &, < и > на их ascii представление
// аля защита от XSS
function escapeCharacters(str) {
	return str.replace(/[&<>]/g, char => {
		if (char === '<') return char = '&lt;';
		else if (char === '>') return char = '&gt;';
		else if (char === '&') return char = '&amp;';
	});
}

function getElement(selector, scope) {
	return (scope || document).querySelector(selector);
}

// Удаление лишних пробелов внутри предложения и по краям
function trimSpaces(str) {
	return str.replace(/ +/g, ' ').trim();
}

export { escapeCharacters, getElement, trimSpaces };
