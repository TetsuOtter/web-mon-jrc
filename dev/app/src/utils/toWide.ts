export function toWide(str: string): string {
	return str.replace(/[\x20-~]/g, (ch) => {
		if (ch === " ") {
			return "\u3000"; // 全角スペース
		}
		return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
	});
}
