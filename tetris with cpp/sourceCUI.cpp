//#define _DEBUG

/*
#include <Windows.h>
#include <stdio.h>
#include <stdlib.h>
#include "tetrisSystem.h"
int main(void) {
	TetrisSystem::init();
	TetrisSystem tetris;
	tetris.clear();
	tetris.setNextMino();
	int count = 0;
	while (TRUE) {
		if (GetAsyncKeyState(VK_LSHIFT) & 1) {
			break;
		}
		count++;
		count %= 8;
		if (tetris.drop(1)) {
			tetris.setNextMino();
		}
		if (count == 0) {
			if (GetAsyncKeyState(VK_RIGHT)) {
				tetris.moveR();
			}
			else if (GetAsyncKeyState(VK_LEFT)) {
				tetris.moveL();
			}
			else if (GetAsyncKeyState('X')) {
				tetris.rotateCW();
			}
			else if (GetAsyncKeyState('Z')) {
				tetris.rotateCCW();
			}
		}
		system("cls");
		tetris.printStage();
		Sleep(16);
	}
	system("pause");
	return EXIT_SUCCESS;
}
*/