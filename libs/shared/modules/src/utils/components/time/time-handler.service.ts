declare type TimeKind = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export interface TimeAgoViewModel {
    num: number;
    timeKind: TimeKind;
}

export class TimeHandler {
    getTimeAgo(todayDate: Date, comparingDate: Date): TimeAgoViewModel {
        const seconds = Math.floor((todayDate.getTime() - comparingDate.getTime()) / 1000);

        let interval = seconds / 31536000;

        if (interval > 1) {
            return { num: Math.floor(interval), timeKind: 'year' };
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return { num: Math.floor(interval), timeKind: 'month' };
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return { num: Math.floor(interval), timeKind: 'day' };
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return { num: Math.floor(interval), timeKind: 'hour' };
        }
        interval = seconds / 60;
        if (interval > 1) {
            return { num: Math.floor(interval), timeKind: 'minute' };
        }
        return { num: Math.floor(seconds), timeKind: 'second' };
    }
}
