#include <windows.h>
#include <stdio.h>
#include <conio.h>

#ifndef ENABLE_VIRTUAL_TERMINAL_PROCESSING)
#define ENABLE_VIRTUAL_TERMINAL_PROCESSING 0x0004
#endif

int main(void)
{
    HANDLE handle;
    handle = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD mode = 0;
    GetConsoleMode(handle, &mode);
    SetConsoleMode(handle, mode | ENABLE_VIRTUAL_TERMINAL_PROCESSING);

    printf("Change text color.\n");
    printf("\x1b[30mBlack\x1b[39m\n");
    printf("\x1b[31mRed\x1b[39m\n");
    printf("\x1b[32mGreen\x1b[39m\n");
    printf("\x1b[33mYellow\x1b[39m\n");
    printf("\x1b[34mBlue\x1b[39m\n");
    printf("\x1b[35mMagenta\x1b[39m\n");
    printf("\x1b[36mCyan\x1b[39m\n");
    printf("\x1b[37mWhite\x1b[39m\n");

    printf("\n");
    printf("Change background color.\n");
    printf("\x1b[40mBlack\x1b[49m\n");
    printf("\x1b[41mRed\x1b[49m\n");
    printf("\x1b[42mGreen\x1b[49m\n");
    printf("\x1b[43mYellow\x1b[49m\n");
    printf("\x1b[44mBlue\x1b[49m\n");
    printf("\x1b[45mMagenta\x1b[49m\n");
    printf("\x1b[46mCyan\x1b[49m\n");
    printf("\x1b[47mGray\x1b[49m\n");

    printf("\n");
    printf("Other Commands.\n");
    printf("\x1b[1mHightlight\x1b[0m  ");
    printf("\x1b[4mUnderline\x1b[0m  ");
    printf("\x1b[7mInversion\x1b[0m  ");
    return 0;
}



