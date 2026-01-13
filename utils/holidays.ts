
import { HolidayInfo } from '../types';

export const getHolidayInfo = (date: Date): HolidayInfo => {
    // Simplified holiday logic
    // In a real app, this would check against a database of holidays
    const month = date.getMonth();
    const day = date.getDate();

    // Example: Christmas
    if (month === 11 && day === 25) {
        return { isHoliday: true, name: 'Navidad' };
    }
    
    // Example: New Year
    if (month === 0 && day === 1) {
        return { isHoliday: true, name: 'Año Nuevo' };
    }

    // Summer break (July/August)
    if (month === 6 || month === 7) {
         return { isHoliday: true, name: 'Vacaciones de Verano' };
    }

    return { isHoliday: false };
};
