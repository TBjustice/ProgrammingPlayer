#pragma once
#include "tetrisSystem.h"

class Alteris : public TetrisSystem {
protected:
	time_t lastRKey = 0;
	time_t lastLKey = 0;
	BOOL isCWValid = TRUE;
	BOOL isCCWValid = TRUE;
	int level = 0;
	BOOL isAltered = FALSE;
public:
	// Queue
	int minoAwait[14] = {};
	// Shift the queue
	void shiftAwait() {
		for (int i = 0; i < 13; i++) {
			minoAwait[i] = minoAwait[i + 1];
		}
		minoAwait[13] = -1;
	}
	// Score
	int score = 0;

	//is the game finished.
	BOOL isGameOver = FALSE;

	void setup() {
		W = 18;
		H = 18;
		level = 0;
		score = 0;
		isGameOver = FALSE;
		clear();
		createBox(&minoAwait[0]);
		createBox(&minoAwait[7]);

		setNextMino(minoAwait[0]);
		shiftAwait();
	}
	void step() {
		time_t now = clock();

		int rkey = VK_RIGHT;
		int lkey = VK_LEFT;
		int downkey = VK_DOWN;
		int cwkey = 'X';
		int ccwkey = 'Z';
		if (isAltered) {
			rkey = VK_UP;
			lkey = VK_DOWN;
			downkey = VK_LEFT;
			cwkey = 'Z';
			ccwkey = 'X';
		}

		double gravity = 1;
		if (GetAsyncKeyState(downkey) & 1)gravity = 20;

		if (drop(gravity)) {
			int dropcount = 0;
			for (int r = 0; r < H; r++) {
				if (sumRowEx(r, W - 2) == W - 2) {
					dropcount++;
					dropRows(r);
				}
			}
			score += dropcount * 10 + dropcount * dropcount * 10;

			droppingType = minoAwait[0];
			droppingRot = 0;
			droppingX = W - 4;
			droppingY = 0;

			lockStart = 0;
			dropStart = clock();
			droppingMaxY = 0;
			lockMoveCount = 0;
			spin = FALSE;

			if (!isMinoAvailable(droppingType, droppingRot, droppingY, droppingX)) {
				isGameOver = TRUE;
				printf("GameOver");
			}
			shiftAwait();
			if (minoAwait[7] == -1) {
				level++;
				interval = max(100, 1000 - level * 15);
				createBox(&minoAwait[7]);
			}

			int stagebuf[30][30];
			for (int r = 0; r < H; r++) {
				for (int c = 0; c < W; c++) {
					stagebuf[r][c] = stage[r][c];
				}
			}
			for (int r = 0; r < H; r++) {
				for (int c = 0; c < W; c++) {
					stage[r][c] = stagebuf[H - c - 1][W - r - 1];
				}
			}
			isAltered = !isAltered;
		}

		if (GetAsyncKeyState(rkey) & 1) {
			if (lastRKey == 0) {
				lastRKey = clock();
				moveR();
			}
			else if (now - lastRKey > 300) {
				lastRKey += 50;
				moveR();
			}
		}
		else lastRKey = 0;

		if (GetAsyncKeyState(lkey) & 1) {
			if (lastLKey == 0) {
				lastLKey = clock();
				moveL();
			}
			else if (now - lastLKey > 300) {
				lastLKey += 50;
				moveL();
			}
		}
		else lastLKey = 0;

		if (GetAsyncKeyState(cwkey) & 1) {
			if (isCWValid) {
				isCWValid = FALSE;
				rotateCW();
			}
		}
		else isCWValid = TRUE;

		if (GetAsyncKeyState(ccwkey) & 1) {
			if (isCCWValid) {
				isCCWValid = FALSE;
				rotateCCW();
			}
		}
		else isCCWValid = TRUE;
	}

	//Draw the stage
	virtual void draw(HDC hdc) {
		SelectObject(hdc, GetStockObject(LTGRAY_BRUSH));
		SelectObject(hdc, GetStockObject(BLACK_PEN));
		Rectangle(hdc, 0, 0, W * 40, H * 40);
		SelectObject(hdc, GetStockObject(WHITE_BRUSH));
		Rectangle(hdc, 0, 80, (W - 2) * 40, H * 40);
		Rectangle(hdc, W * 40 + 10, 10, W * 40 + 80, 80);
		SelectObject(hdc, GetStockObject(DC_BRUSH));

		for (int r = 0; r < 4; r++) {
			for (int c = 0; c < 4; c++) {
				if (minos[minoAwait[0]][0][r][c] == 1) {
					SetDCBrushColor(hdc, minocolor[minoAwait[0]]);
					Rectangle(hdc, c * 15 + W * 40 + 15, r * 15 + 15, (c + 1) * 15 + W * 40 + 15, (r + 1) * 15 + 15);
				}
			}
		}

		for (int r = 0; r < H; r++) {
			for (int c = 0; c < W; c++) {
				if (droppingY <= r && r < droppingY + 4 && droppingX <= c && c < droppingX + 4) {
					if (minos[droppingType][droppingRot][r - droppingY][c - droppingX] == 1) {
						SetDCBrushColor(hdc, minocolor[droppingType]);
						if (isAltered) {
							Rectangle(hdc, (W - r - 1) * 40, (H - c - 1) * 40, (W - r - 1) * 40 + 40, (H - c - 1) * 40 + 40);
							Rectangle(hdc, (W - r - 1) * 40 + 10, (H - c - 1) * 40 + 10, (W - r - 1) * 40 + 30, (H - c - 1) * 40 + 30);
							continue;
						}
						else {
							Rectangle(hdc, c * 40, r * 40, c * 40 + 40, r * 40 + 40);
							Rectangle(hdc, c * 40 + 10, r * 40 + 10, c * 40 + 30, r * 40 + 30);
							continue;
						}
					}
				}
				if (stage[r][c] >= 0) {
					SetDCBrushColor(hdc, minocolor[droppingType]);
					if (isAltered) {
						if (stage[r][c] < 700) {
							SetDCBrushColor(hdc, minocolor[stage[r][c] % 7]);
							Rectangle(hdc, (W - r - 1) * 40, (H - c - 1) * 40, (W - r - 1) * 40 + 40, (H - c - 1) * 40 + 40);
							Rectangle(hdc, (W - r - 1) * 40 + 10, (H - c - 1) * 40 + 10, (W - r - 1) * 40 + 30, (H - c - 1) * 40 + 30);
						}
						else {
							SetDCBrushColor(hdc, RGB(80, 80, 80));
							Rectangle(hdc, (W - r - 1) * 40, (H - c - 1) * 40, (W - r - 1) * 40 + 40, (H - c - 1) * 40 + 40);
						}

					}
					else {
						if (stage[r][c] < 700) {
							SetDCBrushColor(hdc, minocolor[stage[r][c] % 7]);
							Rectangle(hdc, c * 40, r * 40, c * 40 + 40, r * 40 + 40);
							Rectangle(hdc, c * 40 + 10, r * 40 + 10, c * 40 + 30, r * 40 + 30);
						}
						else {
							SetDCBrushColor(hdc, RGB(80, 80, 80));
							Rectangle(hdc, c * 40, r * 40, c * 40 + 40, r * 40 + 40);
						}
					}
				}
			}
		}

		SelectObject(hdc, GetStockObject(WHITE_PEN));
		WCHAR text[64];
		wsprintf(text, L"Score : %d", score);
		TextOutW(hdc, W * 40 + 10, 100, text, lstrlenW(text));
	}
};
