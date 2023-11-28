export const downloadBlob = (file: Blob, name: string) => {
	const url = URL.createObjectURL(file);

	const anchorEl = document.createElement('a');
	anchorEl.href = url;
	anchorEl.download = name;
	anchorEl.target = "_blank";

	anchorEl.click();
}