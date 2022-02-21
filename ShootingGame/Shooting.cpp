#include <windows.h>
#include <winuser.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>
#include "DIBSection.h"

const double DEG2RAD = 3.14159265359 / 180;

#define WIDTH 500
#define HEIGHT 500

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

BOOL InitApp(HINSTANCE _hInst, LPCSTR _szClassName, WNDPROC _WndProc) {
	WNDCLASSEX wc;
	wc.cbSize = sizeof(WNDCLASSEX);
	wc.style = CS_HREDRAW | CS_VREDRAW;
	wc.lpfnWndProc = _WndProc;
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.hInstance = _hInst;
	wc.hIcon = (HICON)LoadIconA(NULL, IDI_APPLICATION);
	wc.hCursor = (HCURSOR)LoadCursorA(NULL, IDC_ARROW);
	wc.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = _szClassName;
	wc.hIconSm = (HICON)LoadImageA(NULL, IDI_APPLICATION, IMAGE_ICON, 0, 0, LR_DEFAULTSIZE | LR_SHARED);
	return (RegisterClassExA(&wc));
}

int WINAPI WinMain(HINSTANCE hCurInst, HINSTANCE hPrevInst, LPSTR lpsCmdLine, int nCmdShow) {
	HWND hWnd;
	MSG msg;
	BOOL bRet;
	srand((unsigned)time(NULL));

	if (!InitApp(hCurInst, "className1", WndProc)) return FALSE;
	hWnd = CreateWindowA(
		"className1",
		"ShootingGame",
		WS_OVERLAPPEDWINDOW,
		0,
		0,
		WIDTH + 20,
		HEIGHT + 40,
		NULL,
		NULL,
		hCurInst,
		NULL);
	ShowWindow(hWnd, nCmdShow);
	UpdateWindow(hWnd);
	while ((bRet = GetMessageA(&msg, NULL, 0, 0)) != 0) {
		if (bRet == -1)
			break;
		else {
			TranslateMessage(&msg);
			DispatchMessageA(&msg);
		}
	}
	return (int)msg.wParam;
}

class Attack {
public:
	double x = 0;
	double y = 0;
	BOOL valid = FALSE;
	void draw(DIBSection* dst) {
		if (valid) {
			SetDCBrushColor(dst->hdc, RGB(0, 0, 255));
			Ellipse(dst->hdc, x - 3, y - 5, x + 3, y + 5);
		}
	}
	void move() {
		if (valid) {
			y -= 5;
			if (y < 0 || y > HEIGHT) {
				valid = FALSE;
			}
		}
	}
};
#define MAXATTACK 300
Attack attack[MAXATTACK];
void setAttack(double x, double y) {
	for (int i = 0; i < MAXATTACK; i++) {
		if (attack[i].valid == FALSE) {
			attack[i].x = x;
			attack[i].y = y;
			attack[i].valid = TRUE;
			break;
		}
	}
}

class Character {
public:
	double x = WIDTH / 2;
	double y = HEIGHT - 30;
	int count = 0;
	int HP = 50;
	int MAXHP = 50;
	POINT pathPoint[12];

	void draw(DIBSection* dst) {
		if (HP > 0) {
			pathPoint[0] = { 3, 1 };
			pathPoint[1] = { 7, 1 };
			pathPoint[2] = { 7, -3 };
			pathPoint[3] = { 7, -7 };
			pathPoint[4] = { 0, -7 };
			pathPoint[5] = { 0, -3 };
			pathPoint[6] = { 0, -7 };
			pathPoint[7] = { -7, -7 };
			pathPoint[8] = { -7, -3 };
			pathPoint[9] = { -7, 1 };
			pathPoint[10] = { -3, 1 };
			pathPoint[11] = { 0, 4 };
			for (int i = 0; i < 12; ++i) {
				pathPoint[i].x += x;
				pathPoint[i].y += y;
			}
			BeginPath(dst->hdc);
			MoveToEx(dst->hdc, pathPoint[11].x, pathPoint[11].y, NULL);
			PolyBezierTo(dst->hdc, pathPoint, 12);
			EndPath(dst->hdc);
			SetDCBrushColor(dst->hdc, RGB(255, 36, 36));
			FillPath(dst->hdc);

			SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
			Rectangle(dst->hdc, 0, HEIGHT - 15 , WIDTH, HEIGHT);
			SetDCBrushColor(dst->hdc, RGB(0, 0, 255));
			Rectangle(dst->hdc, 0, HEIGHT - 15, WIDTH * HP / MAXHP, HEIGHT);
		}
	}
	void move(BOOL isMovable = TRUE) {
		if (HP > 0 && isMovable) {
			if (GetKeyState('D') & 0xff00) {
				x += 2;
				if (x > WIDTH) {
					x = WIDTH;
				}
			}
			if (GetKeyState('A') & 0xff00) {
				x -= 2;
				if (x < 0) {
					x = 0;
				}
			}
			if (GetKeyState('S') & 0xff00) {
				y += 2;
				if (y > HEIGHT - 20) {
					y = HEIGHT - 20;
				}
			}
			if (GetKeyState('W') & 0xff00) {
				y -= 2;
				if (y < 50) {
					y = 50;
				}
			}
			if (count % 10 == 0) {
				setAttack(x, y);
			}
			count++;
			count %= 360;
		}
	}
};
Character character;

class Magic {
public:
	COLORREF color = RGB(255, 134, 129);
	double x = 0;
	double y = 0;
	double vx = 0;
	double vy = 0;
	BOOL valid = FALSE;
	int size = 0;
	void draw(DIBSection* dst) {
		if (valid) {
			SetDCBrushColor(dst->hdc, color);
			Ellipse(dst->hdc, x - size, y - size, x + size, y + size);
		}
	}
	void move(){
		if (valid) {
			x += vx;
			y += vy;
			if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT) {
				valid = FALSE;
			}
		}
	}
	void hit() {
		if (valid) {
			if (abs(x - character.x) < size + 4 && abs(y - character.y) < size + 4) {
				valid = FALSE;
				if(character.HP > 0)character.HP--;
			}
		}
	}
};
#define MAXMAGIC 300
Magic magic[MAXMAGIC];
void setMagic(COLORREF color, double x, double y, double vx, double vy, int size = 10) {
	for (int i = 0; i < MAXMAGIC; i++) {
		if (magic[i].valid == FALSE) {
			magic[i].color = color;
			magic[i].x = x;
			magic[i].y = y;
			magic[i].vx = vx;
			magic[i].vy = vy;
			magic[i].size = size;
			magic[i].valid = TRUE;
			break;
		}
	}
}

class Enemy {
public:
	double x = 0;
	double y = 0;
	int HP = 0;
	int MAXHP = 1;
	virtual void draw(DIBSection* dst, DIBSection* image);
	virtual void move();
	virtual void hit(Attack* at) {
		if (HP > 0 && at->valid) {
			if (x < at->x && at->x < x + 64 && y < at->y && at->y < y + 64) {
				HP--;
				at->valid = FALSE;
			}
		}
	}
};

class Slime : public Enemy{
public:
	int count = 0;
	void draw(DIBSection* dst, DIBSection *image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);
			SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
			Rectangle(dst->hdc, x, y - 10, x + 64, y);
			SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
			Rectangle(dst->hdc, x, y - 10, x + 64 * HP / MAXHP, y);
		}
	}
	void move() {
		if (HP > 0) {
			if(count % 180 < 90){
				x += 3;
			}
			else {
				x -= 3;
			}
			if (count % 45 == 0) {
				for (int i = 0; i < 10; i++) {
					setMagic(RGB(180, 200, 255), x + 32, y + 64, (double)(i - 5)* 0.7, 3, 6);
				}
			}
			count++;
			count %= 360;
		}
	}
};
#define MAXSLIME 5
Slime slime[MAXSLIME];

class Snow : public Enemy{
public:
	int offsetx = 60;
	int offsety = 30;
	int count = 0;
	void draw(DIBSection* dst, DIBSection* image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);
			SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
			Rectangle(dst->hdc, x, y - 10, x + 64, y);
			SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
			Rectangle(dst->hdc, x, y - 10, x + 64 * HP / MAXHP, y);
		}
	}
	void move() {
		if (HP > 0) {
			x = offsetx + 90 * sin(count * 2 * DEG2RAD);
			y = offsety + 30 * sin(count * 3 * DEG2RAD);
			if (count % 30 == 0) {
				for (int i = 0; i < 5; i++) {
					setMagic(RGB(238, 240, 255), x + 32, y + 64, (double)(i - 2), 3, 8);
				}
			}
			count++;
			count %= 360;
		}
	}
};
#define MAXSNOW 5
Snow snow[MAXSNOW];

class Eye : public Enemy {
public:
	double offsetx = 50;
	int count = 0;
	void draw(DIBSection* dst, DIBSection* image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);
			SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
			Rectangle(dst->hdc, x, y - 10, x + 64, y);
			SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
			Rectangle(dst->hdc, x, y - 10, x + 64 * HP / MAXHP, y);
		}
	}
	void move() {
		if (HP > 0) {
			x = offsetx + 60 * sin(count * DEG2RAD);
			if (count % 60 == 0) {
				for (int i = 0; i < 10; i++) {
					double buf = atan2(y + 32 + 40 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 40 * cos(i * 36 * DEG2RAD) - character.x);
					setMagic(RGB(255, 255, 43), x + 32 + 40 * cos(i * 36 * DEG2RAD), y + 32 + 40 * sin(i * 36 * DEG2RAD), -4 * cos(buf), -4 * sin(buf), 4);
				}
			}
			count++;
			count %= 360;
		}
	}
};
#define MAXEYE 5
Eye eye[MAXEYE];

class Cloud : public Enemy {
public:
	int offsetx = 80;
	int offsety = 65;
	int count = 0;
	void draw(DIBSection* dst, DIBSection* image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);
			SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
			Rectangle(dst->hdc, x, y - 10, x + 64, y);
			SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
			Rectangle(dst->hdc, x, y - 10, x + 64 * HP / MAXHP, y);
		}
	}
	void move() {
		if (HP > 0) {
			x = offsetx + 80 * cos(count * 2 * DEG2RAD);
			y = offsety + 50 * sin(count * 2 * DEG2RAD);
			if (count % 30 == 0) {
				setMagic(RGB(12, 12, 95), x + 32, y + 32, 0, 5, 5);
				setMagic(RGB(12, 12, 95), x + 4, y + 32, -0.6, 5, 5);
				setMagic(RGB(12, 12, 95), x + 60, y + 32, 0.6, 5, 5);
			}
			count++;
			count %= 360;
		}
	}
};
#define MAXCLOUD 5
Cloud cloud[MAXCLOUD];

class Boss1 : public Enemy {
public:
	int count = 0;
	int lastHP = 0;
	void draw(DIBSection* dst, DIBSection* image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);

			if (HP < 100) {
				SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * HP / 100, y);
			}
			else if (HP < 200) {
				SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(0, 200, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * (HP - 100) / 100, y);
			}
			else {
				SetDCBrushColor(dst->hdc, RGB(0, 200, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(0, 255, 255));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * (HP - 200) / 100, y);
			}

		}
	}
	void move() {
		if (HP > 0) {
			if (HP < 100) {
				if (lastHP == 200)count = 0;
				x = (WIDTH - 64) / 2 + 90 * sin(count * 2 * DEG2RAD);
				y = 50 - 30 * cos(count * 3 * DEG2RAD);
				if (count % 5 == 0) {
					setMagic(RGB(228, 197, 228), x + 32, y + 32, 2 * cos(count * 2 * DEG2RAD), 2 * sin(count * 2 * DEG2RAD), 6);
				}
				if (count % 20 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 60 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			else if (HP < 200) {
				if (count % 5 == 0) {
					setMagic(RGB(228, 197, 228), x + 32, y + 32, 2 * cos(count * 3 * DEG2RAD), 2 * sin(count * 3 * DEG2RAD), 6);
				}
				if (count % 30 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 72 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			else {
				if (count % 60 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 90 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			count++;
			count %= 360;
			lastHP = HP;
		}
	}
};
Boss1 boss1;

class Boss2 : public Enemy {
public:
	int count = 0;
	int lastHP = 0;
	HWND hWnd = NULL;
	void draw(DIBSection* dst, DIBSection* image) {
		if (HP > 0) {
			dst->AlphaBlt(image, x, y);

			if (HP < 100) {
				SetDCBrushColor(dst->hdc, RGB(128, 128, 128));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * HP / 100, y);
			}
			else if (HP < 200) {
				SetDCBrushColor(dst->hdc, RGB(255, 0, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(0, 200, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * (HP - 100) / 100, y);
			}
			else {
				SetDCBrushColor(dst->hdc, RGB(0, 200, 0));
				Rectangle(dst->hdc, x, y - 10, x + 64, y);
				SetDCBrushColor(dst->hdc, RGB(0, 255, 255));
				Rectangle(dst->hdc, x, y - 10, x + 64.0 * (HP - 200) / 100, y);
			}

		}
	}
	void move() {
		if (HP > 0) {
			if (HP < 100) {
				if (count % 10 == 0) {
					SetWindowPos(hWnd, HWND_TOP, rand() % 300, rand() % 100, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
				}
				if (lastHP == 200)count = 0;
				x = (WIDTH - 64) / 2 + 90 * sin(count * 2 * DEG2RAD);
				y = 50 - 30 * cos(count * 3 * DEG2RAD);
				if (count % 5 == 0) {
					setMagic(RGB(228, 197, 228), x + 32, y + 32, 2 * cos(count * 2 * DEG2RAD), 2 * sin(count * 2 * DEG2RAD), 6);
				}
				if (count % 20 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 60 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			else if (HP < 200) {
				if (count % 20 == 0) {
					SetWindowPos(hWnd, HWND_TOP, rand() % 300, rand() % 100, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
				}
				if (count % 5 == 0) {
					setMagic(RGB(228, 197, 228), x + 32, y + 32, 2 * cos(count * 3 * DEG2RAD), 2 * sin(count * 3 * DEG2RAD), 6);
				}
				if (count % 30 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 72 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			else {
				if (count % 30 == 0) {
					SetWindowPos(hWnd, HWND_TOP, rand() % 300, rand() % 100, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
				}
				if (count % 60 == 0) {
					for (int i = 0; i < 10; i++) {
						double buf = atan2(y + 32 + 50 * sin(i * 36 * DEG2RAD) - character.y, x + 32 + 50 * cos(i * 36 * DEG2RAD) - character.x);
						setMagic(RGB(164, 75, 164), x + 32 + 50 * cos(i * 36 * DEG2RAD), y + 32 + 50 * sin(i * 36 * DEG2RAD), -5.5 * cos(buf), -5.5 * sin(buf), 5);
					}
				}
				if (count % 40 == 0) {
					for (int i = 0; i < 10; i++) {
						setMagic(RGB(164, 75, 164), x + 32, y + 64, (double)(i - 5) * 0.7, 3, 6);
					}
				}
				if (count % 90 == 0) {
					for (int i = 0; i < 11; i++) {
						setMagic(RGB(164, 75, 164), x + 32 + (i - 5) * 7, y + 64, 0, 3, 6);
					}
				}
			}
			count++;
			count %= 360;
			lastHP = HP;
		}
	}
};
Boss2 boss2;

const int MAXENEMY = MAXSLIME + MAXSNOW + MAXEYE + MAXCLOUD + 2;
Enemy* enemies[MAXENEMY];

void SetStage(int level) {
	if (level == 0) {
		slime[0].x = (WIDTH - 270) / 2 - 32;
		slime[0].y = 15;
		slime[0].HP = 30;
		slime[0].MAXHP = 30;
	}
	else if(level == 1){
		for (int i = 0; i < 3; i++) {
			slime[i].x = i * 100 + 60;
			slime[i].y = 15;
			slime[i].count = i * 60;
			slime[i].HP = 60;
			slime[i].MAXHP = 60;
		}
	}
	else if (level == 4) {
		snow[0].offsetx = 90;
		snow[0].offsety = 75;
		snow[1].offsetx = WIDTH / 2 - 32;
		snow[1].offsety = 45;
		snow[2].offsetx = WIDTH - 90 - 64;
		snow[2].offsety = 75;
		for (int i = 0; i < 3; i++) {
			snow[i].count = i * 60;
			snow[i].HP = 60;
			snow[i].MAXHP = 60;
		}
	}
	else if (level == 3) {
		eye[0].offsetx = 60;
		eye[1].offsetx = (60 + WIDTH / 2 - 32) / 2;
		eye[2].offsetx = WIDTH / 2 - 32;
		eye[3].offsetx = (WIDTH / 2 - 32 + WIDTH - 60 - 64) / 2;
		eye[4].offsetx = WIDTH - 60 - 64;
		for (int i = 0; i < 5; i++) {
			eye[i].count = i * 36;
			eye[i].HP = 60;
			eye[i].MAXHP = 60;
			eye[i].y = 15 + (i % 2) * 50;
		}
	}
	else if (level == 2) {
		cloud[0].offsetx = 90;
		cloud[1].offsetx = (90 + WIDTH / 2 - 32) / 2;
		cloud[2].offsetx = WIDTH / 2 - 32;
		cloud[3].offsetx = (WIDTH / 2 - 32 + WIDTH - 90 - 64) / 2;
		cloud[4].offsetx = WIDTH - 90 - 64;
		for (int i = 0; i < 5; i++) {
			cloud[i].count = i * 72;
			cloud[i].HP = 50;
			cloud[i].MAXHP = 50;
		}
	}
	else if (level == 5) {
		boss1.x = (WIDTH - 64) / 2;
		boss1.y = 20;
		boss1.HP = 300;
		boss1.MAXHP = 300;
	}
	else if (level == 6) {
		boss2.x = (WIDTH - 64) / 2;
		boss2.y = 20;
		boss2.HP = 300;
		boss2.MAXHP = 300;
	}
}

void CenterTextOut(HDC hdc, int y, LPCSTR text) {
	SIZE size;
	GetTextExtentPoint32A(hdc, text, strlen(text), &size);
	TextOutA(hdc, (WIDTH - size.cx) / 2, y, text, strlen(text));
}

BOOL MessageTextOut(HDC hdc, int y, LPCSTR text, LPCSTR textsub) {
	static int count = 0;
	count++;
	if (count >= strlen(text) * 2) {
		if (count >= strlen(text) * 2 + 36) {
			count = strlen(text) * 2;
		}
		if (GetKeyState(VK_RETURN) & 0xff00) {
			count = 0;
			return TRUE;
		}
		if (count - strlen(text) * 2 < 18) {
			CenterTextOut(hdc, 250, textsub);
		}
		CenterTextOut(hdc, y, text);
	}
	else {
		SIZE size;
		GetTextExtentPoint32A(hdc, text, strlen(text), &size);
		TextOutA(hdc, (WIDTH - size.cx) / 2, y, text, count / 2);
	}
	return FALSE;
}

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wp, LPARAM lp) {
	static PAINTSTRUCT ps;
	static HDC hdc;
	static DIBSection backbuffer;
	static DIBSection images[6];
	static int action = 0;
	static int counter = 0;
	static char textbuf[]="Stage 0";
	switch (msg) {
	case WM_CREATE:
		SetTimer(hWnd, 1, 33, NULL);
		backbuffer.Create(WIDTH, HEIGHT, RGB(213, 174, 153));
		images[0].Load("./images/slime.bmp");
		images[1].Load("./images/snow.bmp");
		images[2].Load("./images/eye.bmp");
		images[3].Load("./images/cloud.bmp");
		images[4].Load("./images/boss1.bmp");
		images[5].Load("./images/boss2.bmp");
		for (int i = 0; i < 6; i++) {
			images[i].UseAlphaMask(RGB(255, 255, 255));
		}
		{
			int j = 0;
			for (int i = 0; i < MAXSLIME; i++) {
				enemies[j++] = &slime[i];
			}
			for (int i = 0; i < MAXSNOW; i++) {
				enemies[j++] = &snow[i];
			}
			for (int i = 0; i < MAXEYE; i++) {
				enemies[j++] = &eye[i];
			}
			for (int i = 0; i < MAXCLOUD; i++) {
				enemies[j++] = &cloud[i];
			}
			enemies[j++] = &boss1;
			enemies[j++] = &boss2;
		}
		boss2.hWnd = hWnd;
		break;
	case WM_TIMER:
		if (wp == 1) {
			if (action == 1 || action == 3 || action == 5 || action == 7 || action == 9 || action == 13 || action == 31) {
				character.move();
				BOOL isGameOver = TRUE;
				for (int e = 0; e < MAXENEMY; e++) {
					enemies[e]->move();
					if (enemies[e]->HP > 0) {
						isGameOver = FALSE;
					}
				}
				for (int i = 0; i < MAXMAGIC; i++) {
					magic[i].move();
					magic[i].hit();
				}
				for (int i = 0; i < MAXATTACK; i++) {
					attack[i].move();
					for (int e = 0; e < MAXENEMY; e++) {
						enemies[e]->hit(&attack[i]);
					}
				}
				if (isGameOver) {
					for (int i = 0; i < MAXMAGIC; i++) {
						magic[i].valid = FALSE;
					}
					for (int i = 0; i < MAXATTACK; i++) {
						attack[i].valid = FALSE;
					}
					character.x = WIDTH / 2;
					character.y = HEIGHT - 30;
					action++;
				}
			}
			InvalidateRect(hWnd, NULL, FALSE);
		}
		break;
	case WM_PAINT:
		backbuffer.Create(WIDTH, HEIGHT, RGB(213, 174, 153));
		
		SelectObject(backbuffer.hdc, GetStockObject(DC_BRUSH));
		SelectObject(backbuffer.hdc, GetStockObject(NULL_PEN));

		character.draw(&backbuffer);

		switch (action)
		{
		case 0:
			CenterTextOut(backbuffer.hdc, 280, "Use WASD to Move Your Character");
		case 2:
		case 4:
		case 6:
		case 8:
			textbuf[6] = '0' + (char)(action / 2);
			CenterTextOut(backbuffer.hdc, 220, textbuf);
			CenterTextOut(backbuffer.hdc, 250, "Press Enter to Start");
			if (GetKeyState(VK_RETURN) & 0xff00) {
				SetStage(action / 2);
				action++;
			}
			break;
		case 10:
			if (MessageTextOut(backbuffer.hdc, 220, "There is a boss of this underground temple behind this door.", "Press Enter to Go Inside")) {
				action++;
			}
			break;
		case 11:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "No way! How can human reach here?!", "Press Enter......")) {
				action++;
			}
			break;
		case 12:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "I will tell you after I defeat you!!", "Stage 5.  Press Enter to Start")) {
				SetStage(5);
				action++;
			}
			break;
		case 14:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "Did I...... lose......?", "Press Enter......")) {
				action++;
			}
			break;
		case 15:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "How can it be?! Who are you?! WHAT are you?!", "Press Enter......")) {
				action++;
			}
			break;
		case 16:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "I am a \"Yusha\", the one who is blessed by the \"Creator\".", "Press Enter......")) {
				action++;
			}
			break;
		case 17:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "\"Creator\" ordered me to defeat you, and gave me a useful skill.", "Press Enter......")) {
				action++;
			}
			break;
		case 18:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "\"Restart\". This sill enables me to travel back through time when I die.", "Press Enter......")) {
				action++;
			}
			break;
		case 19:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "As long as I have this skill, you won\'t defeat me.", "Press Enter......")) {
				action++;
			}
			break;
		case 20:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "HAHAHAHA...... Now I understand......", "Press Enter......")) {
				action++;
			}
			break;
		case 21:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "That's why only a human beging can defeat me......", "Press Enter......")) {
				action++;
			}
			break;
		case 22:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "Yes. So, demon. Any last words?", "Press Enter......")) {
				action++;
			}
			break;
		case 23:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "Well, \"Yusha\". Do you know the side effects of the skill?", "Press Enter......")) {
				action++;
			}
			break;
		case 24:
			backbuffer.AlphaBlt(&images[4], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "Side effects?", "Press Enter......")) {
				action++;
			}
			break;
		case 25:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "\"WORLDQUAKE\"!!", "Press Enter......")) {
				action++;
			}
			counter++;
			counter %= 360;
			if (counter % 90 == 0) {
				SetWindowPos(hWnd, HWND_TOP, 100, 0, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
			}
			else if (counter % 90 == 18) {
				SetWindowPos(hWnd, HWND_TOP, 100, 0, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
			}
			else if (counter % 90 == 36) {
				SetWindowPos(hWnd, HWND_TOP, 100, 100, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
			}
			else if (counter % 90 == 54) {
				SetWindowPos(hWnd, HWND_TOP, 200, 0, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
			}
			else if (counter % 90 == 72) {
				SetWindowPos(hWnd, HWND_TOP, 0, 100, 0, 0, SWP_NOSIZE | SWP_NOREPOSITION | SWP_NOREDRAW);
			}
			break;
		case 26:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, HEIGHT - 90, "What...... did you do?", "Press Enter......")) {
				action++;
			}
			break;
		case 27:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "\"WORLDQUAKE.\" This magic shakes the world itself.", "Press Enter......")) {
				action++;
			}
			break;
		case 28:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "This magic does not effect anyone in this world.", "Press Enter......")) {
				action++;
			}
			break;
		case 29:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "Except those who has the skill given by the \"Creator\"", "Press Enter......")) {
				action++;
			}
			break;
		case 30:
			backbuffer.AlphaBlt(&images[5], (WIDTH - 64) / 2, 20);
			if (MessageTextOut(backbuffer.hdc, 80, "You shall die \"Yusha\"......!", "Stage 6.  Press Enter to Start")) {
				SetStage(6);
				action++;
			}
			break;
		default:
			if (character.HP == 0) {
				TextOutA(backbuffer.hdc, 175, 250, "Press Enter to Restart", 22);
				if (GetKeyState(VK_RETURN) & 0xff00) {
					character.HP = character.MAXHP;
					for (int e = 0; e < MAXENEMY; e++) {
						enemies[e]->HP = 0;
					}
					for (int i = 0; i < MAXMAGIC; i++) {
						magic[i].valid = FALSE;
					}
					for (int i = 0; i < MAXATTACK; i++) {
						attack[i].valid = FALSE;
					}
					action = 0;
				}
			}
			boss1.draw(&backbuffer, &images[4]);
			boss2.draw(&backbuffer, &images[5]);
			for (int i = 0; i < MAXSLIME; i++) {
				slime[i].draw(&backbuffer, &images[0]);
			}
			for (int i = 0; i < MAXSNOW; i++) {
				snow[i].draw(&backbuffer, &images[1]);
			}
			for (int i = 0; i < MAXEYE; i++) {
				eye[i].draw(&backbuffer, &images[2]);
			}
			for (int i = 0; i < MAXCLOUD; i++) {
				cloud[i].draw(&backbuffer, &images[3]);
			}
			for (int i = 0; i < MAXMAGIC; i++) {
				magic[i].draw(&backbuffer);
			}
			for (int i = 0; i < MAXATTACK; i++) {
				attack[i].draw(&backbuffer);
			}
			break;
		}

		hdc = BeginPaint(hWnd, &ps);
		BitBlt(hdc, 0, 0, WIDTH, HEIGHT, backbuffer.hdc, 0, 0, SRCCOPY);
		EndPaint(hWnd, &ps);
		break;
	case WM_SIZE:
	case WM_MOVE:
		break;
	case WM_DESTROY:
		for (int i = 0; i < 6; i++) {
			images[i].Release();
		}
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProcA(hWnd, msg, wp, lp);
	}
	return 0;
}
