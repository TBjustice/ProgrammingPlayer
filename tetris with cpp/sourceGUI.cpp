//#define _DEBUG

#include <Windows.h>
#include <stdio.h>
#include <stdlib.h>
#include "tetrisSystem.h"

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

BOOL InitApp(HINSTANCE _hInst, LPCWSTR _szClassName, WNDPROC _WndProc) {
	WNDCLASSEXW wc;
	wc.cbSize = sizeof(WNDCLASSEXW);
	wc.style = CS_HREDRAW | CS_VREDRAW;
	wc.lpfnWndProc = _WndProc;
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.hInstance = _hInst;
	wc.hIcon = (HICON)LoadIconW(NULL, MAKEINTRESOURCEW(32512));
	wc.hCursor = (HCURSOR)LoadCursorW(NULL, MAKEINTRESOURCEW(32512));
	wc.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = _szClassName;
	wc.hIconSm = (HICON)LoadImageW(NULL, MAKEINTRESOURCEW(32512), IMAGE_ICON, 0, 0, LR_DEFAULTSIZE | LR_SHARED);
	return (RegisterClassExW(&wc));
}

#ifdef _DEBUG
int main(void) {
	HINSTANCE hCurInst = NULL;
	int nCmdShow = SW_SHOW;
#else
int WINAPI WinMain(HINSTANCE hCurInst, HINSTANCE hPrevInst, LPSTR lpsCmdLine, int nCmdShow) {
#endif // !DEBUG
	SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE);
	HWND hWnd;
	MSG msg;
	BOOL bRet;

	if (!InitApp(hCurInst, L"className1", WndProc)) return FALSE;
	hWnd = CreateWindowW(
		L"className1",
		L"Tetris",
		WS_OVERLAPPEDWINDOW,
		0,
		0,
		500,
		500,
		NULL,
		NULL,
		hCurInst,
		NULL);
	ShowWindow(hWnd, nCmdShow);
	UpdateWindow(hWnd);
	while ((bRet = GetMessageW(&msg, NULL, 0, 0)) != 0) {
		if (bRet == -1)
			break;
		else {
			TranslateMessage(&msg);
			DispatchMessageW(&msg);
		}
	}
	return (int)msg.wParam;
}


LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wp, LPARAM lp) {
	static PAINTSTRUCT ps;
	static HDC hdc;
	static TetrisSystem tetris;
	static int count;
	static HDC buffer_hdc;
	static HBITMAP buffer_hbmp;
	static int isGameOver = 0;
	switch (msg) {
	case WM_CREATE:
		hdc = GetDC(hWnd);
		buffer_hdc = CreateCompatibleDC(hdc);
		buffer_hbmp = CreateCompatibleBitmap(hdc, 480, 720);
		SelectObject(buffer_hdc, buffer_hbmp);
		ReleaseDC(hWnd, hdc);

		TetrisSystem::init();
		tetris.clear();
		tetris.setNextMino();
		SetTimer(hWnd, 1, 16, NULL);
		break;
	case WM_TIMER:
		if (wp == 1) {
			if (!isGameOver) {
				count++;
				count %= 8;
				double gravity = 1;
				if (GetAsyncKeyState(VK_DOWN) & 1) {
					gravity = 20;
				}
				if (tetris.drop(gravity)) {
					for (int r = 0; r < tetris.H; r++) {
						printf("%d %d\n", r, tetris.sumRow(r));
						if (tetris.sumRow(r) == tetris.W) {
							tetris.dropRows(r);
						}
					}
					if (tetris.setNextMino() == 0) {
						isGameOver = 1;
					}
				}
				if (count == 0) {
					if (GetAsyncKeyState(VK_RIGHT) & 1) {
						tetris.moveR();
					}
					else if (GetAsyncKeyState(VK_LEFT) & 1) {
						tetris.moveL();
					}
					else if (GetAsyncKeyState('X') & 1) {
						tetris.rotateCW();
					}
					else if (GetAsyncKeyState('Z') & 1) {
						tetris.rotateCCW();
					}
				}
				InvalidateRect(hWnd, NULL, FALSE);
			}
		}
		break;
	case WM_PAINT:
		tetris.draw(buffer_hdc);
		hdc = BeginPaint(hWnd, &ps);
		BitBlt(hdc, 0, 0, 480, 720, buffer_hdc, 0, 0, SRCCOPY);
		EndPaint(hWnd, &ps);
		break;
	case WM_DESTROY:
		DeleteDC(buffer_hdc);
		DeleteObject(buffer_hbmp);
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProcW(hWnd, msg, wp, lp);
	}
	return 0;
}

