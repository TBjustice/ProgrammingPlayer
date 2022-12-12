#include <Windows.h>

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
	HWND hWnd;

	if (!RegisterApp("WinAppLikeMac", WndProc)) return FALSE;

	hWnd = CreateWindowA(
		"WinAppLikeMac",
		"",
		WS_POPUP,
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
	switch (msg) {
	case WM_KEYDOWN:
		if (wp == VK_ESCAPE) {
			DestroyWindow(hWnd);
		}
		return 0;
	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProcA(hWnd, msg, wp, lp);
}

