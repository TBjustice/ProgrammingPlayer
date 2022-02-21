#include <Windows.h>

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
				return true;
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
			return false;
		}
	}
	void Load(LPCSTR name) {
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
	void UseAlphaMask(COLORREF colorTrans) {
		if (hBitmap != NULL) {
			unsigned long size = width * height, i;
			for (i = 0; i < size; ++i) {
				if (RGB(pixel[i * 4 + 2], pixel[i * 4 + 1], pixel[i * 4]) == colorTrans) {
					pixel[i * 4 + 3] = 0;
				}
				else {
					pixel[i * 4 + 3] = 255;
				}
			}
		}
	}
	void AlphaBlt(DIBSection* src, int offsetx, int offsety) {
		if (hBitmap != NULL) {
			for (int y = 0; y < src->height; ++y) {
				if (0 <= offsety + y && offsety + y < height) {
					for (int x = 0; x < src->width; ++x) {
						if (0 <= offsetx + x && offsetx + x < width) {
							int i = y * src->width + x;
							int j = (offsety + y) * width + offsetx + x;
							float alpha = src->pixel[i * 4 + 3] / 255.f;
							float beta = 1 - alpha;
							pixel[j * 4] = beta * pixel[j * 4] + alpha * src->pixel[i * 4];
							pixel[j * 4 + 1] = beta * pixel[j * 4 + 1] + alpha * src->pixel[i * 4 + 1];
							pixel[j * 4 + 2] = beta * pixel[j * 4 + 2] + alpha * src->pixel[i * 4 + 2];
						}
					}
				}
			}
		}
	}
};