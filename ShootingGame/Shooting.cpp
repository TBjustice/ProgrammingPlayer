#include <windows.h>
#include <math.h>
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
			pathPoint[0] = { 2, 1 };
			pathPoint[1] = { 5, 1 };
			pathPoint[2] = { 5, -2 };
			pathPoint[3] = { 5, -5 };
			pathPoint[4] = { 0, -5 };
			pathPoint[5] = { 0, -2 };
			pathPoint[6] = { 0, -5 };
			pathPoint[7] = { -5, -5 };
			pathPoint[8] = { -5, -2 };
			pathPoint[9] = { -5, 1 };
			pathPoint[10] = { -2, 1 };
			pathPoint[11] = { 0, 3 };
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
				if (y > HEIGHT - 10) {
					y = HEIGHT - 10;
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
				character.HP--;
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

const int MAXENEMY = MAXSLIME + MAXSNOW;
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
	else if (level == 2) {
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
}

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wp, LPARAM lp) {
	static PAINTSTRUCT ps;
	static HDC hdc;
	static DIBSection backbuffer;
	static DIBSection images[6];
	static int action = 0;
	switch (msg) {
	case WM_CREATE:
		SetTimer(hWnd, 1, 30, NULL);
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
		}
		break;
	case WM_TIMER:
		if (wp == 1) {
			if (action == 1 || action == 3 || action == 5) {
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
					action++;
				}
			}
			else {
				if (GetKeyState(VK_RETURN) & 0xff00) {
					switch (action)
					{
					case 0:
					case 2:
					case 4:
						SetStage(action / 2);
						for (int i = 0; i < MAXMAGIC; i++) {
							magic[i].valid = FALSE;
						}
						for (int i = 0; i < MAXATTACK; i++) {
							attack[i].valid = FALSE;
						}
						character.x = WIDTH / 2;
						character.y = HEIGHT - 30;
						break;
					default:
						break;
					}
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

		if (action == 1 || action == 3 || action == 5) {
			character.draw(&backbuffer);

			for (int i = 0; i < MAXSLIME; i++) {
				slime[i].draw(&backbuffer, &images[0]);
			}
			for (int i = 0; i < MAXSNOW; i++) {
				snow[i].draw(&backbuffer, &images[1]);
			}

			for (int i = 0; i < MAXMAGIC; i++) {
				magic[i].draw(&backbuffer);
			}

			for (int i = 0; i < MAXATTACK; i++) {
				attack[i].draw(&backbuffer);
			}
		}
		else {
			if (action == 0) {
				TextOutA(backbuffer.hdc, 210, 120, "Stage 0", 7);
				TextOutA(backbuffer.hdc, 180, 150, "Press Enter to Start", 20);
				TextOutA(backbuffer.hdc, 120, 180, "Use WASD to Move Your Character", 31);
			}
			if (action == 2) {
				TextOutA(backbuffer.hdc, 210, 120, "Stage 1", 7);
				TextOutA(backbuffer.hdc, 180, 150, "Press Enter to Start", 20);
			}
			if (action == 4) {
				TextOutA(backbuffer.hdc, 210, 120, "Stage 2", 7);
				TextOutA(backbuffer.hdc, 180, 150, "Press Enter to Start", 20);
			}
		}

		hdc = BeginPaint(hWnd, &ps);
		BitBlt(hdc, 0, 0, WIDTH, HEIGHT, backbuffer.hdc, 0, 0, SRCCOPY);
		EndPaint(hWnd, &ps);
		break;
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProcA(hWnd, msg, wp, lp);
	}
	return 0;
}
