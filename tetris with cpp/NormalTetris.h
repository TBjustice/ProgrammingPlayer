#pragma once
#include "tetrisSystem.h"

class NormalTetris : public TetrisSystem {
protected:
	time_t lastRKey = 0;
	time_t lastLKey = 0;
	BOOL isCWValid = TRUE;
	BOOL isCCWValid = TRUE;
	int level = 0;
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
		
		double gravity = 1;
		if (GetAsyncKeyState(VK_DOWN) & 1)gravity = 20;

		if (drop(gravity)) {
			int dropcount = 0;
			for (int r = 0; r < H; r++) {
				if (sumRow(r) == W){
					dropcount++;
					dropRows(r);
				}
			}
			score += dropcount * 10 + dropcount * dropcount * 10;

			if (!setNextMino(minoAwait[0])) {
				isGameOver = TRUE;
				printf("GameOver");
			}
			shiftAwait();
			if (minoAwait[7] == -1) {
				level++;
				interval = max(100, 1000 - level * 40);
				createBox(&minoAwait[7]);
			}
		}

		if (GetAsyncKeyState(VK_RIGHT) & 1) {
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

		if (GetAsyncKeyState(VK_LEFT) & 1) {
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

		if (GetAsyncKeyState('X') & 1) {
			if (isCWValid) {
				isCWValid = FALSE;
				rotateCW();
			}
		}
		else isCWValid = TRUE;

		if (GetAsyncKeyState('Z') & 1) {
			if (isCCWValid) {
				isCCWValid = FALSE;
				rotateCCW();
			}
		}
		else isCCWValid = TRUE;
	}

	//Draw the stage
	virtual void draw(HDC hdc) {
		SelectObject(hdc, GetStockObject(WHITE_BRUSH));
		SelectObject(hdc, GetStockObject(BLACK_PEN));
		Rectangle(hdc, 0, 0, W * 40, (H - 2) * 40);
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

		for (int r = 2; r < H; r++) {
			for (int c = 0; c < W; c++) {
				if (droppingY <= r && r < droppingY + 4 && droppingX <= c && c < droppingX + 4) {
					if (minos[droppingType][droppingRot][r - droppingY][c - droppingX] == 1) {
						SetDCBrushColor(hdc, minocolor[droppingType]);
						Rectangle(hdc, c * 40, (r - 2) * 40, c * 40 + 40, (r - 2) * 40 + 40);
						Rectangle(hdc, c * 40 + 10, (r - 2) * 40 + 10, c * 40 + 30, (r - 2) * 40 + 30);
						continue;
					}
				}
				if (stage[r][c] >= 0) {
					if (stage[r][c] < 700) {
						SetDCBrushColor(hdc, minocolor[stage[r][c] % 7]);
						Rectangle(hdc, c * 40, (r - 2) * 40, c * 40 + 40, (r - 2) * 40 + 40);
						SetDCBrushColor(hdc, RGB(0, 0, 0));
						Rectangle(hdc, c * 40 + 10, (r - 2) * 40 + 10, c * 40 + 30, (r - 2) * 40 + 30);
					}
					else {
						SetDCBrushColor(hdc, RGB(80, 80, 80));
						Rectangle(hdc, c * 40, (r - 2) * 40, c * 40 + 40, (r - 2) * 40 + 40);
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
