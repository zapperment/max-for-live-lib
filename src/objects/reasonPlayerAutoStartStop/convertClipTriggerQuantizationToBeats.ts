export default function (clipTriggerQuantization: number) {
    switch (clipTriggerQuantization) {
        // 0 = None
        case 0:
            return 0;
        // 1 = 8 Bars
        case 1:
            return 0;
        // 2 = 4 Bars
        case 2:
            return 0;
        // 3 = 2 Bars
        case 3:
            return 0;
        // 4 = 1 Bar
        case 4:
            return 0;
        // 5 = 1/2
        case 5:
            return 0;
        // 6 = 1/2T
        case 6:
            return 0;
        // 7 = 1/4
        case 7:
            return 0;
        // 8 = 1/4T
        case 8:
            return 0;
        // 9 = 1/8
        case 9:
            return 0;
        // 10 = 1/8T
        case 10:
            return 0;
        // 11 = 1/16
        case 11:
            return 0;
        // 12 = 1/16T
        case 12:
            return 0;
        // 13 = 1/32
        case 13:
            return 0;
    }
}