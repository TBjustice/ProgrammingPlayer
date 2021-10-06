#include <windows.h>
int main(void) {
	while (true) {
		if (GetAsyncKeyState(VK_MBUTTON) & 1) {
			keybd_event(VK_LWIN, 0, 0, 0);
			keybd_event('D', 0, 0, 0);
			keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0);
			keybd_event('D', 0, KEYEVENTF_KEYUP, 0);
		}
		Sleep(50);
	}
	return 0;
}

