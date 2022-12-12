#include <Windows.h>
#include <windowsx.h>

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

BOOL RegisterApp(const char* windowID, WNDPROC windowProc) {
	WNDCLASSEXA wc;
	wc.cbSize = sizeof(WNDCLASSEXA);
	wc.style = CS_HREDRAW | CS_VREDRAW;
	wc.lpfnWndProc = windowProc;
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.hInstance = GetModuleHandleA(NULL);
	wc.hIcon = (HICON)LoadIconA(NULL, (const char*)32512);
	wc.hCursor = (HCURSOR)LoadCursorA(NULL, (const char*)32512);
	wc.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = windowID;
	wc.hIconSm = (HICON)LoadImageA(NULL, (const char*)32512, IMAGE_ICON, 0, 0, LR_DEFAULTSIZE | LR_SHARED);
	return (RegisterClassExA(&wc));
}

int WINAPI WinMain(HINSTANCE hCurInst, HINSTANCE hPrevInst, LPSTR lpsCmdLine, int nCmdShow) {
	SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE);

	HWND hWnd;

	if (!RegisterApp("WinAppLikeMac", WndProc)) return FALSE;

	hWnd = CreateWindowA(
		"WinAppLikeMac",
		"",
		WS_POPUP | WS_BORDER,
		100, 100, 500, 300,
		NULL, NULL, hCurInst, NULL);

	ShowWindow(hWnd, SW_SHOW);
	UpdateWindow(hWnd);

	MSG msg;
	BOOL value;
	while (TRUE) {
		value = GetMessageA(&msg, NULL, 0, 0);
		if (value == 0) break;
		if (value == -1)return 1;

		TranslateMessage(&msg);
		DispatchMessageA(&msg);
	}
	return 0;
}

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wp, LPARAM lp) {
	static PAINTSTRUCT ps;
	static HDC hdc;
	static RECT windowrect;
	static HGDIOBJ defpen, defbrush;
	static HBRUSH titlebrush;
	static int mousex, mousey;
	switch (msg) {
	case WM_CREATE:
		titlebrush = CreateSolidBrush(RGB(235, 235, 235));
		return 0;
	case WM_PAINT:
		hdc = BeginPaint(hWnd, &ps);
		defbrush = SelectObject(hdc, titlebrush);
		defpen = SelectObject(hdc, GetStockObject(NULL_PEN));
		Rectangle(hdc, 0, 0, windowrect.right - windowrect.left, 32);
		SelectObject(hdc, defbrush);
		SelectObject(hdc, defpen);
		EndPaint(hWnd, &ps);
		break;
	case WM_SIZE:
	case WM_SIZING:
	case WM_MOVE:
	case WM_MOVING:
		GetWindowRect(hWnd, &windowrect);
		return 0;
	case WM_NCHITTEST:
		mousex = GET_X_LPARAM(lp);
		mousey = GET_Y_LPARAM(lp);
		if (mousey <= windowrect.top + 5) {
			if (mousex <= windowrect.left + 5)return HTTOPLEFT;
			if (mousex >= windowrect.right - 5)return HTTOPRIGHT;
			return HTTOP;
		}
		else if (mousey <= windowrect.top + 32)return HTCAPTION;
		else if (mousey >= windowrect.bottom - 5) {
			if (mousex <= windowrect.left + 5)return HTBOTTOMLEFT;
			if (mousex >= windowrect.right - 5)return HTBOTTOMRIGHT;
			return HTBOTTOM;
		}
		if (mousex <= windowrect.left + 5)return HTLEFT;
		if (mousex >= windowrect.right - 5)return HTRIGHT;
		return HTCLIENT;
	case WM_KEYDOWN:
		if (wp == VK_ESCAPE) {
			DestroyWindow(hWnd);
		}
		return 0;
	case WM_DESTROY:
		DeleteObject(titlebrush);
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProcA(hWnd, msg, wp, lp);
}

