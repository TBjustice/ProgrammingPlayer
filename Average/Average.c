#include <stdio.h>

int main(void)
{
    double result = 0;
    double n;
    for (n = 0; ; n+=1) {
        int input;
        scanf("%d", &input);
        result = n/(n+1)*result + input/(n+1);
        printf("Data Size:%d\n", (int)n + 1);
        printf("Average was %lf\n", result);
    }
    return 0;
}


/*
int main(void){
    int n;
    double result = 0;
    for (n = 0; n < 3; n++) {
        int input;
        scanf("%d", &input);
        result += (double)input;
    }
    printf("Average was %f\n", result / 3);
    return 0;
}
*/

/*
int main(void){
    int n;
    double result = 0;
    for (n = 0; n < 3; n++) {
        int input;
        scanf("%d", &input);
        result += (double)input / 3;
    }
    printf("Average was %f\n", result);
    return 0;
}
*/