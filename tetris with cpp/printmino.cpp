#include "printmino.h"

void printMinoData(const unsigned char mino[4][4][4]) {
	for (int minotype = 0; minotype < 4; ++minotype) {
		printf("[%d]\n", minotype);
		for (int y = 0; y < 4; ++y) {
			for (int x = 0; x < 4; ++x) {
				printf("%c", mino[minotype][y][x] == 0 ? ' ' : 'M');
			}
			printf("\n");
		}
	}
}

void printMino(const unsigned char mino[4][4]) {
	for (int y = 0; y < 4; ++y) {
		for (int x = 0; x < 4; ++x) {
			printf("%c", mino[y][x] == 0 ? ' ' : 'M');
		}
		printf("\n");
	}
}
