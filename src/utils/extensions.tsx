import dayjs from "dayjs"

export const toDate = (value: string) => {
    return dayjs().format('DD MMM YYYY')
}

export const toAge = (value: string) => {
    const birthday = dayjs(value);
    const ageInMonths = dayjs().diff(birthday, 'month');
    
    if(ageInMonths == 0) {
        return '';
    }

    const numberOfYears = Math.floor(ageInMonths / 12);
    const numberOfMonths = ageInMonths % 12;

    const years = `${numberOfYears} year${numberOfYears > 1 ? 's' : ''}`;
    
    if(numberOfMonths == 0) {
        return years;
    }
    return `${years} and ${numberOfMonths} month${numberOfMonths > 1 ? 's' : ''}`;
}