#pragma once
#include <Windows.h>
#include <stdlib.h>
#include <vector>

class DIBSection {
public:
	int width = 0;
	int height = 0;
	LPBYTE pixel = NULL;
	HDC hdc = NULL;
	HBITMAP hBitmap = NULL;
	~DIBSection() {
		Release();
	}
	void Release() {
		if (hdc != NULL) {
			DeleteDC(hdc);
			hdc = NULL;
		}
		if (hBitmap != NULL) {
			DeleteObject(hBitmap);
			hBitmap = NULL;
		}
		width = 0;
		height = 0;
	}
	bool Create(int w, int h, COLORREF color = 0) {
		if (w > 0 && h > 0) {
			if (w == width && h == height) {
				SelectObject(hdc, CreateSolidBrush(color));
				PatBlt(hdc, 0, 0, w, h, PATCOPY);
				DeleteObject(SelectObject(hdc, GetStockObject(WHITE_BRUSH)));
			}
			else {
				Release();
				width = w;
				height = h;
				BITMAPINFO bmpInfo;
				ZeroMemory(&bmpInfo, sizeof(bmpInfo));
				bmpInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
				bmpInfo.bmiHeader.biWidth = width;
				bmpInfo.bmiHeader.biHeight = -(height);
				bmpInfo.bmiHeader.biPlanes = 1;
				bmpInfo.bmiHeader.biBitCount = 32;
				bmpInfo.bmiHeader.biCompression = BI_RGB;
				hBitmap = CreateDIBSection(NULL, &bmpInfo, DIB_RGB_COLORS, (void**)&pixel, NULL, 0);
				if (hBitmap != NULL) {
					HDC hDC = GetDC(NULL);
					hdc = CreateCompatibleDC(hDC);
					SelectObject(hdc, hBitmap);
					ReleaseDC(NULL, hDC);
					SelectObject(hdc, CreateSolidBrush(color));
					PatBlt(hdc, 0, 0, w, h, PATCOPY);
					DeleteObject(SelectObject(hdc, GetStockObject(WHITE_BRUSH)));
					return true;
				}
				else {
					hBitmap = NULL;
					width = 0;
					height = 0;
					return false;
				}
			}
		}
		else {
			Release();
		}
	}
	void operator =(HBITMAP src) {
		BITMAP bmp;
		GetObject(src, sizeof(bmp), &bmp);
		HDC hDC = GetDC(NULL);
		HDC hSrcDC = CreateCompatibleDC(hDC);
		if (Create(bmp.bmWidth, bmp.bmHeight)) {
			SelectObject(hSrcDC, src);
			BitBlt(hdc, 0, 0, bmp.bmWidth, bmp.bmHeight, hSrcDC, 0, 0, SRCCOPY);
		}
		DeleteDC(hSrcDC);
		ReleaseDC(NULL, hDC);
	}
	void Load(TCHAR* name) {
		HBITMAP src = (HBITMAP)LoadImage(GetModuleHandle(NULL), name, IMAGE_BITMAP, 0, 0, LR_LOADFROMFILE);
		BITMAP bmp;
		GetObject(src, sizeof(bmp), &bmp);
		HDC hDC = GetDC(NULL);
		HDC hSrcDC = CreateCompatibleDC(hDC);
		if (Create(bmp.bmWidth, bmp.bmHeight)) {
			SelectObject(hSrcDC, src);
			BitBlt(hdc, 0, 0, bmp.bmWidth, bmp.bmHeight, hSrcDC, 0, 0, SRCCOPY);
		}
		DeleteDC(hSrcDC);
		ReleaseDC(NULL, hDC);
		DeleteObject(src);
	}
};

namespace MonitorManager {
	RECT MonitorRect;
	std::vector<RECT> MonitorsRect;
	std::vector<RECT> DisplaysRect;
	BOOL CALLBACK MEProc(HMONITOR hMon, HDC hdcMon, LPRECT lpMon, LPARAM dwDate) {
		MonitorsRect.push_back(*lpMon);
		return true;
	}
	void initMonitorManager() {
		MonitorRect = { 0, 0, 0, 0 };
		SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE);
		std::vector<RECT>().swap(MonitorsRect);
		std::vector<RECT>().swap(DisplaysRect);
		EnumDisplayMonitors(NULL, NULL, MEProc, 0);
		for (int i = 0; i < MonitorsRect.size(); ++i) {
			MonitorRect.left = min(MonitorRect.left, MonitorsRect[i].left);
			MonitorRect.top = min(MonitorRect.top, MonitorsRect[i].top);
			MonitorRect.right = max(MonitorRect.left, MonitorsRect[i].left);
			MonitorRect.bottom = max(MonitorRect.top, MonitorsRect[i].top);
		}
		for (int i = 0; i < MonitorsRect.size(); ++i) {
			DisplaysRect.push_back({ MonitorsRect[i].left - MonitorRect.left, MonitorsRect[i].top - MonitorRect.top, MonitorsRect[i].right - MonitorRect.left, MonitorsRect[i].bottom - MonitorRect.top });
		}
	}
	void Monitor2Display(POINT* point) {
		point->x -= MonitorRect.left;
		point->y -= MonitorRect.top;
	}
}

class WallpaperWindow {
private:
	static HWND hWorkerWnd;
    static BOOL CALLBACK EWProc(HWND hWnd, LPARAM lp) {
        HWND p = FindWindowEx(hWnd, NULL, L"SHELLDLL_DefView", NULL);
        if (p) {
            HWND* wallpaper = (HWND*)lp;
            *wallpaper = FindWindowEx(NULL, hWnd, L"WorkerW", NULL);
        }
        return true;
    }
    static HWND GetWorkerWindow() {
		HWND progman = FindWindow(L"Progman", NULL);
		if (progman) {
			SendMessageTimeout(progman, 0x052C, 0, 0, SMTO_NORMAL, 1000, nullptr);
			HWND hWallpaperWnd = NULL;
			EnumWindows(EWProc, (LPARAM)&hWallpaperWnd);
			return hWallpaperWnd;
		}
		return NULL;
	}
public:
	static void MainLoop(void(*callFunc)() = nullptr) {
		MSG msg;
		BOOL bRet;
		if (callFunc != nullptr) {
			while (true) {
				if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
					if (msg.message == WM_QUIT) {
						break;
					}
					TranslateMessage(&msg);
					DispatchMessage(&msg);
				}
				else {
					callFunc();
				}
			}
		}
		else {
			while ((bRet = GetMessage(&msg, NULL, 0, 0)) != 0) {
				if (bRet == -1)	break;
				else {
					TranslateMessage(&msg);
					DispatchMessage(&msg);
				}
			}
		}
	}
private:
	TCHAR className[64] = L"";
	bool SetClassName() {
		if (hWorkerWnd == NULL) return false;
		for (int i = 0; i < 100; ++i) {
			wsprintf(className, L"WallPaper%d", i);
			if (FindWindowEx(hWorkerWnd, NULL, className, NULL) == NULL)return true;
		}
		wsprintf(className, L"");
		return false;
	}
public:
	HWND hWnd;
	COLORREF colorback = 0;
	void init(WNDPROC WndProc, int x, int y, int w, int h) {
		if (hWorkerWnd == NULL) {
			hWorkerWnd = GetWorkerWindow();
		}
		if (hWorkerWnd == NULL) return;
		if (!SetClassName()) return;
		WNDCLASSEX wc;
		wc.cbSize = sizeof(WNDCLASSEX);
		wc.style = CS_HREDRAW | CS_VREDRAW;
		wc.lpfnWndProc = WndProc;
		wc.cbClsExtra = 0;
		wc.cbWndExtra = 0;
		wc.hInstance = 0;
		wc.hIcon = (HICON)LoadIcon(NULL, IDI_APPLICATION);
		wc.hCursor = (HCURSOR)LoadCursor(NULL, IDC_ARROW);
		wc.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
		wc.lpszMenuName = NULL;
		wc.lpszClassName = (LPCWSTR)className;
		wc.hIconSm = (HICON)LoadImage(NULL, IDI_APPLICATION, IMAGE_ICON, 0, 0, LR_DEFAULTSIZE | LR_SHARED);
		if (!RegisterClassEx(&wc)) return;
		hWnd = CreateWindow(
			className,
			className,
			0,
			x,
			y,
			w,
			h,
			NULL,
			NULL,
			0,
			NULL);
		SetWindowLong(hWnd, GWL_STYLE, 0);
		SetParent(hWnd, hWorkerWnd);
		ShowWindow(hWnd, SW_SHOW);
		UpdateWindow(hWnd);
	}
	void init(WNDPROC WndProc) {
		if (hWorkerWnd == NULL) {
			hWorkerWnd = GetWorkerWindow();
		}
		if (hWorkerWnd == NULL) return;
		if (!SetClassName()) return;
		WNDCLASSEX wc;
		wc.cbSize = sizeof(WNDCLASSEX);
		wc.style = CS_HREDRAW | CS_VREDRAW;
		wc.lpfnWndProc = WndProc;
		wc.cbClsExtra = 0;
		wc.cbWndExtra = 0;
		wc.hInstance = 0;
		wc.hIcon = (HICON)LoadIcon(NULL, IDI_APPLICATION);
		wc.hCursor = (HCURSOR)LoadCursor(NULL, IDC_ARROW);
		wc.hbrBackground = CreateSolidBrush(colorback);
		wc.lpszMenuName = NULL;
		wc.lpszClassName = (LPCWSTR)className;
		wc.hIconSm = (HICON)LoadImage(NULL, IDI_APPLICATION, IMAGE_ICON, 0, 0, LR_DEFAULTSIZE | LR_SHARED);
		if (!RegisterClassEx(&wc)) return;
		hWnd = CreateWindow(
			className,
			className,
			0,
			0,
			0,
			0,
			0,
			NULL,
			NULL,
			0,
			NULL);
		SetWindowLong(hWnd, GWL_STYLE, 0);
		SetParent(hWnd, hWorkerWnd);
		ShowWindow(hWnd, SW_MAXIMIZE);
		UpdateWindow(hWnd);
	}
	operator HWND() {
		return hWnd;
	}
};
HWND WallpaperWindow::hWorkerWnd = NULL;
