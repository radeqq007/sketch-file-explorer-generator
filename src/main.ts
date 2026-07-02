import "./style.css";
import rough from "roughjs";

const filesTextArea = document.getElementById("files") as HTMLTextAreaElement;
const spaceRange = document.getElementById("space") as HTMLInputElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const rc = rough.canvas(canvas);

await document.fonts.load('20px "Patrick Hand"');
ctx.font = '20px "Patrick Hand"';

const height = canvas.height;
const width = canvas.width;
const padding = 15;
const barHeight = 30;

const explorerWidth = width - padding * 2;
const explorerHeight = height - padding * 2;

const getFiles = (): string[] => {
	return filesTextArea.value.split("\n").map(v => v.trim()).filter(Boolean);
};

const getSpacing = (): number => {
  return Number(spaceRange.value)
}

const drawWindow = () => {
	rc.rectangle(padding, padding, explorerWidth, explorerHeight, {
		fill: "white",
		fillStyle: "solid",
	});
};

const drawBar = () => {
	rc.rectangle(padding, padding, explorerWidth, barHeight, {
		fill: "LightBlue",
		fillStyle: "solid",
	});

	ctx.save();

	ctx.translate(padding + 8, padding + 4);
	rc.path(
		"m5 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
		{ fill: "yellow", roughness: 0, fillStyle: "solid" },
	);

	ctx.restore();

	ctx.fillText("File Explorer", padding * 3.5, padding * 2.45);

	rc.rectangle(width - padding * 3, padding * 1.3, 22, 22, {
		fill: "LightCoral",
		fillStyle: "solid",
	});

	ctx.save();
	ctx.translate(width - padding * 3.1, padding * 1.25);
	rc.path("M18 6 6 18");
	rc.path("m6 6 12 12");
	ctx.restore();
};

const drawPathBar = (path: string) => {
	rc.rectangle(padding + 10, padding + barHeight + 10, explorerWidth - 20, 24);
	ctx.fillText(path, padding * 2, padding * 2.9 + barHeight);
};

const drawFiles = (files: string[]) => {
	const iconLeft = 11.2;
	const iconRight = 56;
	const iconCenter = (iconLeft + iconRight) / 2;

  const cellWidth = getSpacing();   // horizontal space reserved per file
	const cellHeight = 110;

  const startX = padding * 6;
	const startY = padding * 4.4 + barHeight;

  const availableWidth = explorerWidth - (startX - padding) - padding;
	const columns = Math.max(1, Math.floor(availableWidth / cellWidth));

	files.forEach((file, i) => {
    const col = i % columns;
		const row = Math.floor(i / columns);

    const fileX = startX + col * cellWidth;
		const fileY = startY + row * cellHeight;
		const translateX = fileX - iconCenter;

		ctx.save();
		ctx.translate(translateX, fileY);

    if (file.slice(-1) === "/") {
      rc.path(
        "m13 36.4 3.9-7.54A5.2 5.2 0 0 1 24.024 26H52a5.2 5.2 0 0 1 5.044 6.5l-4.004 15.6a5.2 5.2 0 0 1-5.07 3.9H10.4a5.2 5.2 0 0 1-5.2-5.2V13a5.2 5.2 0 0 1 5.2-5.2h10.14a5.2 5.2 0 0 1 4.394 2.34l2.106 3.12a5.2 5.2 0 0 0 4.342 2.34H46.8a5.2 5.2 0 0 1 5.2 5.2v5.2",
        { fill: "#e8df5f", fillStyle: "solid" },
      );
      
    } else {
      rc.path(
        "M16.8 61.6a5.6 5.6 0 0 1-5.6-5.6V11.2a5.6 5.6 0 0 1 5.6-5.6h22.4a6.72 6.72 0 0 1 4.771 1.977l10.046 10.046A6.72 6.72 0 0 1 56 22.4v33.6a5.6 5.6 0 0 1-5.6 5.6z",
        { fill: "#feffd6", fillStyle: "solid" },
      );
      rc.path("M39.2 5.6v14a2.8 2.8 0 0 0 2.8 2.8h14");
      rc.path("M28 25.2H22.4");
      rc.path("M44.8 36.4H22.4");
      rc.path("M44.8 47.6H22.4");
    }

    ctx.restore();
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillText(file, fileX, fileY + 82);
    ctx.restore();
	});
};

const drawExplorer = (path: string, files: string[]) => {
	drawWindow();
	drawBar();
	drawPathBar(path);
	drawFiles(files);
};

drawExplorer("example/src/", getFiles());

const btn = document.getElementById("generate")!;
const pathInput = document.getElementById("path") as HTMLInputElement;

btn.addEventListener("click", () => {
	const path = pathInput.value;
	if (path.length > 50) {
		alert("Path cannot be longer than 50 characters.");
		return;
	}
	ctx.clearRect(0, 0, width, height);
	drawExplorer(pathInput.value, getFiles());
});
