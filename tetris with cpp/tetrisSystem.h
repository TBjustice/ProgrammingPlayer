#pragma once
#include <Windows.h>
#include <stdlib.h>
#include <time.h>
#include "minodata.h"
#include "printmino.h"

typedef int stageInfo;

class TetrisSystem {
private:
protected:
	/// Array "minos" contains the shape of mino. minos[MinoType][Rotation][Y][X].
	static MINOBOOL minos[7][4][4][4];

	/// Array "minoname" contains the name of each minotype.
	static const char minoname[];

	/// Array "minoname" contains the color of each minotype.
	static const COLORREF minocolor[];
public:
	//Initialize mino shape.
	static void init() {
		srand((unsigned)time(NULL));

		for (int minotype = 0; minotype < 7; minotype++) {
			for (int y = 0; y < 4; y++) {
				for (int x = 0; x < 4; x++) {
					minos[minotype][0][y][x] = minodata[minotype][y][x];
					if (minotype < 5) {
						if (x < 3 && y < 3) {
							minos[minotype][1][y][x] = minodata[minotype][2 - x][y];
							minos[minotype][2][y][x] = minodata[minotype][2 - y][2 - x];
							minos[minotype][3][y][x] = minodata[minotype][x][2 - y];
						}
					}
					else {
						minos[minotype][1][y][x] = minodata[minotype][3 - x][y];
						minos[minotype][2][y][x] = minodata[minotype][3 - y][3 - x];
						minos[minotype][3][y][x] = minodata[minotype][x][3 - y];
					}
				}
			}
		}
	}

	//Debug mino shape.
	static void showMino() {
		for (int i = 0; i < 7; i++) {
			printf("Mino Name:%c\n", minoname[i]);
			printMinoData(minos[i]);
		}
	}

	static void createBox(int* minoBox) {
		for (int i = 0; i < 7; i++) {
			minoBox[i] = i;
		}
		for (int i = 0; i < 7; i++) {
			int swapidx = rand() % 7;
			int buf = minoBox[i];
			minoBox[i] = minoBox[swapidx];
			minoBox[swapidx] = buf;
		}
	}

private:
protected:
	// Lock and drop counter
	time_t lockStart = 0;
	time_t dropStart = 0;
	int droppingMaxY = 0;
	int lockMoveCount = 0;

	// Dropping mino's type, rotation, and place.
	int droppingType = 0;
	int droppingRot = 0;
	int droppingX = 0;
	int droppingY = 0;
public:
	//-1:Cell without block. (0 to 7)*100:Cell with block. stage[row][column]
	stageInfo stage[30][30];
	//Size of stage.
	int W = 10, H = 20;
	//Spin checker
	BOOL spin = FALSE;
	// Interval
	int interval = 1000;

	// ****************************** Init the stage ******************************
	
	// Clear the stage with -1.
	void clear() {
		for (int r = 0; r < H; r++) {
			for (int c = 0; c < W; c++) {
				stage[r][c] = -1;
			}
		}
	}

	// Apply row by text
	void setRow(int r, const char* text) {
		int len = strlen(text) < W ? strlen(text) : W;
		for (int c = 0; c < len; c++) {
			if (text[c] == ' ') stage[r][c] = -1;
			else stage[r][c] = 1000;
		}
	}

	// ****************************** Fundamental operation to the stage ******************************

	// Get the satge info.
	stageInfo getStage(int r, int c) {
		if (r < 0 || r >= H || c < 0 || c >= W)return 1000;
		return stage[r][c];
	}

	// Lock the dropping mino to the stage.
	void lockDroppingMino() {
		for (int r = 0; r < 4; r++) {
			for (int c = 0; c < 4; c++) {
				if (minos[droppingType][droppingRot][r][c] == 1) {
					stage[droppingY + r][droppingX + c] = droppingType; //
				}
			}
		}
	}

	// Check the sum of blocks in the certain row/column.
	int sumRow(int r) {
		int result = 0;
		for (int c = 0; c < W; c++) {
			if (stage[r][c] >= 0) result++;
		}
		return result;
	}
	int sumRowEx(int r, int limit) {
		int result = 0;
		for (int c = 0; c < limit; c++) {
			if (stage[r][c] >= 0) result++;
		}
		return result;
	}

	// Drop the certain row.
	void dropRows(int row) {
		for (int c = 0; c < W; c++) {
			for (int r = row; r > 0; r--) {
				stage[r][c] = stage[r - 1][c];
			}
			stage[0][c] = -1;
		}
	}

	//Next mino
	BOOL setNextMino(int minotype) {
		droppingType = minotype;
		droppingRot = 0;
		droppingX = (W / 2) - 2;
		droppingY = 0;

		lockStart = 0;
		dropStart = clock();
		droppingMaxY = 0;
		lockMoveCount = 0;
		spin = FALSE;

		return isMinoAvailable(droppingType, droppingRot, droppingY, droppingX);
	}

	// ****************************** Super rotating system ******************************

	// Check if the mino can be set to the certain position.
	BOOL isMinoAvailable(int minotype, int rotation, int offsetY, int offsetX) {
		for (int r = 0; r < 4; r++) {
			for (int c = 0; c < 4; c++) {
				if (minos[minotype][rotation][r][c] == 1 && getStage(offsetY + r, offsetX + c) >= 0)return FALSE;
			}
		}
		return TRUE;
	}

	// Rotate the mino.
	// LR:1 if CW, -1 if CWW
	// Return value. 0:fail. 1:success
	int isRotationAvailable(int LR, int* offsetY, int* offsetX) {
		*offsetX = 0;
		*offsetY = 0;
		int rotated = (droppingRot + LR + 4) % 4;
		if (droppingType < 5) {//Is not O or I mino
			//First assertion.
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Second assertion.
			if (droppingRot == 0 || droppingRot == 2)*offsetX = (droppingRot - 1)*LR;
			else *offsetX = 2 - droppingRot;
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Third assertion.
			if (droppingRot == 0 || droppingRot == 2)*offsetY = -1;
			else *offsetY = 1;
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Forth assertion.
			*offsetX = 0;
			if (droppingRot == 0 || droppingRot == 2)*offsetY = 2;
			else *offsetY = -2;
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Fifth assertion.
			if (droppingRot == 0 || droppingRot == 2)*offsetX = -LR;
			else *offsetX = 2 - droppingRot;
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
		}
		else if (droppingType == 6) {//Is I mino
			//First assertion.
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Second assertion.
			if (droppingRot == 1 || droppingRot == 3)*offsetX = (droppingRot - 2) * ((LR == 1) ? 1 : -2);
			else *offsetX = (droppingRot - 1) * ((LR == 1) ? 2 : 1);
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Third assertion.
			if (droppingRot == 1 || droppingRot == 3)*offsetX = (droppingRot - 2) * ((LR == 1) ? -2 : 1);
			else *offsetX = (droppingRot - 1) * ((LR == 1) ? -1 : -2);
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Forth assertion.
			if (droppingRot == 1 || droppingRot == 3)*offsetX = (droppingRot - 2) * ((LR == 1) ? 1 : -2);
			else *offsetX = (droppingRot - 1) * ((LR == 1) ? 2 : 1);
			if (droppingRot == 1 || droppingRot == 3)*offsetY = (droppingRot - 2) * ((LR == 1) ? 2 : 1);
			else *offsetY = (droppingRot - 1) * ((LR == 1) ? -1 : 2);
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
			//Fifth assertion.
			if (droppingRot == 1 || droppingRot == 3)*offsetX = (droppingRot - 2) * ((LR == 1) ? -2 : 1);
			else *offsetX = (droppingRot - 1) * ((LR == 1) ? -1 : -2);
			if (droppingRot == 1 || droppingRot == 3)*offsetY = (droppingRot - 2) * ((LR == 1) ? -1 : -2);
			else *offsetY = (droppingRot - 1) * ((LR == 1) ? 2 : -1);
			if (isMinoAvailable(droppingType, rotated, droppingY + (*offsetY), droppingX + (*offsetX)))return TRUE;
		}
		return FALSE;
	}

	// ****************************** Move Mino ******************************
	
	void moveR() {
		if (isMinoAvailable(droppingType, droppingRot, droppingY, droppingX + 1)) {
			droppingX += 1;
			if (lockStart != 0) {//If the block-lock count is started.
				lockStart = 0;   //Stop counting.
				lockMoveCount++; //But add 1 to the move-count.
			}
			spin = FALSE;
		}
	}
	void moveL() {
		if (isMinoAvailable(droppingType, droppingRot, droppingY, droppingX - 1)) {
			droppingX -= 1;
			if (lockStart != 0) {//If the block-lock count is started.
				lockStart = 0;   //Stop counting.
				lockMoveCount++; //But add 1 to the move-count.
			}
			spin = FALSE;
		}
	}
	void rotateCW() {
		int dx, dy;
		if (isRotationAvailable(1, &dy, &dx)) {
			droppingX += dx;
			droppingY += dy;
			droppingRot = (droppingRot + 1) % 4;
			if (lockStart != 0) {//If the block-lock count is started.
				lockStart = 0;   //Stop counting.
				lockMoveCount++; //But add 1 to the move-count.
			}
			spin = TRUE;
		}
	}
	void rotateCCW() {
		int dx, dy;
		if (isRotationAvailable(-1, &dy, &dx)) {
			droppingX += dx;
			droppingY += dy;
			droppingRot = (droppingRot + 3) % 4;
			if (lockStart != 0) {//If the block-lock count is started.
				lockStart = 0;   //Stop counting.
				lockMoveCount++; //But add 1 to the move-count.
			}
			spin = TRUE;
		}
	}
	BOOL drop(double gravity) {
		time_t now = clock();
		if (isMinoAvailable(droppingType, droppingRot, droppingY + 1, droppingX)) {
			lockStart = 0; //Stop counting the block-lock count.
			if ((now - dropStart) * gravity > interval) { //If the time count is over the interval
				dropStart = now; //Reset the block-drop count.
				droppingY += 1;
				spin = FALSE;
				if (droppingMaxY < droppingY) {
					lockMoveCount = 0;
					droppingMaxY = droppingY;
				}
			}
		}
		else {
			dropStart = now; //Reset the block-drop count.
			if (lockStart == 0)lockStart = now; //Set the block-lock count.
			else if (now - lockStart > 500 || lockMoveCount >= 15) { //If the lock-count is over 500[ms] or move-count >= 15.
				lockDroppingMino();
				return TRUE;
			}
		}
		return FALSE;
	}

	//Debug the stage.
	virtual void printStage() {
		for (int r = 2; r < H; r++) {
			for (int c = 0; c < W; c++) {
				if (droppingY <= r && r < droppingY + 4 && droppingX <= c && c < droppingX + 4) {
					if (minos[droppingType][droppingRot][r - droppingY][c - droppingX] == 1) {
						printf("@");
						continue;
					}
				}
				if (stage[r][c] == -1) printf(" ");
				else if (stage[r][c] < 700) printf("%c", minoname[stage[r][c] % 7]);
				else printf("#");
			}
			printf("|\n");
		}
		for (int c = 0; c < W; c++) printf("=");
		printf("\n");
	}
};
MINOBOOL TetrisSystem::minos[7][4][4][4];
const char TetrisSystem::minoname[] = { 'T','S','Z','L','J','O','I' };
const COLORREF TetrisSystem::minocolor[] = {
	RGB(185, 5, 255),
	RGB(100, 255, 0),
	RGB(255, 15, 60),
	RGB(250, 100, 5),
	RGB(20, 20, 255),
	RGB(255, 255, 0),
	RGB(10, 230, 255)
};
