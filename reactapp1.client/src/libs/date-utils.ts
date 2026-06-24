/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const dateToString = (date: any) => {
    if (!date) return ""; // אם אין תאריך, מחזירים מחרוזת ריקה

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // חודשים ב-JavaScript מתחילים מ-0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};