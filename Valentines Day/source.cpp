#include "Wallpaper.h"
#define TIMERID 1
#define NUMPARTICLE 100
const double DEG2RAD = 3.14159265359 / 180;

using namespace MonitorManager;
WallpaperWindow window;

class Particle {
	int x = 0;
	int y = 0;
	int theta = 0;
	double scale = 1;
	TRIVERTEX vertex[2];
	GRADIENT_RECT gRect;
	POINT pathPoint[12];
	void compile() {
		pathPoint[0] = { 20, -20 };
		pathPoint[1] = { 50, -20 };
		pathPoint[2] = { 50, -50 };
		pathPoint[3] = { 50, -80 };
		pathPoint[4] = { 0, -80 };
		pathPoint[5] = { 0, -50 };
		pathPoint[6] = { 0, -80 };
		pathPoint[7] = { -50, -80 };
		pathPoint[8] = { -50, -50 };
		pathPoint[9] = { -50, -20 };
		pathPoint[10] = { -20, -20 };
		pathPoint[11] = { 0, 0 };

		for (int i = 0; i < 12; ++i) {
			pathPoint[i].x *= scale * cos(theta * DEG2RAD);
			pathPoint[i].y *= scale;
			pathPoint[i].x += x;
			pathPoint[i].y += y;
		}
	}
public:
	Particle() {
		ZeroMemory(pathPoint, sizeof(POINT) * 12);
		vertex[0].x = 0;
		vertex[0].y = 0;
		vertex[0].Red = 0xff00;
		vertex[0].Green = 0x3000;
		vertex[0].Blue = 0x3000;
		vertex[0].Alpha = 0x0000;
		vertex[1].x = 0;
		vertex[1].y = 0;
		vertex[1].Red = 0xff00;
		vertex[1].Green = 0x8000;
		vertex[1].Blue = 0x8000;
		vertex[1].Alpha = 0x0000;
		gRect = { 0, 1 };

		x = rand() % 1920;
		y = rand() % 1080;
		theta = rand() % 360;
		scale = (rand() % 100) * 0.01 + 0.1;
	}
	void place(POINT place) {
		x = place.x;
		y = place.y;
	}
	void move() {
		y += 5;
		theta += 2;
		if (y > 1080) {
			x = rand() % 1920;
			y = 0;
			scale = (rand() % 100) * 0.01 + 0.1;
		}
	}
	void draw(HDC hdc) {
		compile();
		BeginPath(hdc);
		MoveToEx(hdc, pathPoint[11].x, pathPoint[11].y, NULL);
		PolyBezierTo(hdc, pathPoint, 12);
		EndPath(hdc);
		SelectClipPath(hdc, RGN_COPY);
		vertex[0].x = x - 50 * scale * abs(cos(theta * DEG2RAD));
		vertex[0].y = y - 80 * scale;
		vertex[1].x = x + 50 * scale * abs(cos(theta * DEG2RAD));
		vertex[1].y = y;
		GdiGradientFill(hdc, vertex, 2, &gRect, 1, GRADIENT_FILL_RECT_H);
	}
};

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wp, LPARAM lp) {
	static PAINTSTRUCT ps;
	static HDC hdc;
	static DIBSection buffer;
	static Particle particle[NUMPARTICLE];
	switch (msg) {
	case WM_CREATE:
		SetTimer(hWnd, TIMERID, 30, NULL);
		return 0;
	case WM_TIMER:
		if (wp == TIMERID) {
			InvalidateRect(hWnd, NULL, FALSE);
		}
		return 0;
	case WM_PAINT:
		buffer.Create(1920, 1080, RGB(0xFF, 0xF4, 0xE4));
		SelectObject(buffer.hdc, GetStockObject(DC_BRUSH));
		SetDCBrushColor(hdc, RGB(255, 0, 0));
		for (int i = 0; i < NUMPARTICLE; ++i) {
			particle[i].move();
			particle[i].draw(buffer.hdc);
		}
		SelectClipRgn(buffer.hdc, NULL);

		hdc = BeginPaint(hWnd, &ps);
		for (int i = 0; i < DisplaysRect.size(); ++i) {
			StretchBlt(hdc,
				DisplaysRect[i].left, DisplaysRect[i].top,
				DisplaysRect[i].right - DisplaysRect[i].left, DisplaysRect[i].bottom - DisplaysRect[i].top,
				buffer.hdc, 0, 0, 1920, 1080,
				SRCCOPY
				);
		}
		EndPaint(hWnd, &ps);
		return 0;
	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProc(hWnd, msg, wp, lp);
}

void CallBack() {
	if (GetAsyncKeyState(VK_RSHIFT) & 1) {
		DestroyWindow(window);
	}
}

#ifdef _DEBUG
int main(void) {
#else
	INT WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
#endif
	initMonitorManager();
	window.init(WndProc);
	WallpaperWindow::MainLoop(CallBack);
	return 0;
}
