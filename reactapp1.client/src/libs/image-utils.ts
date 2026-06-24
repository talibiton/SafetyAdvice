/**
 * פונקציות עזר לעיבוד תמונות
 */

export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.0 - 1.0
}

export interface CompressionResult {
    compressedImage: string;
    originalSize: number;
    compressedSize: number;
    savingPercent: number;
}

/**
 * דחיסת תמונה לפורמט base64
 * @param file קובץ התמונה
 * @param options אפשרויות דחיסה
 * @returns Promise עם התמונה המדוחסת ומידע נוסף
 */
export const compressImage = (
    file: File,
    options: ImageCompressionOptions = {}
): Promise<CompressionResult> => {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.7
    } = options;

    return new Promise((resolve, reject) => {
        // בדיקת תקינות
        if (!file.type.startsWith('image/')) {
            reject(new Error('הקובץ אינו תמונה'));
            return;
        }

        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error('שגיאה בקריאת הקובץ'));
        };

        reader.onload = (e) => {
            const img = new Image();

            img.onerror = () => {
                reject(new Error('שגיאה בטעינת התמונה'));
            };

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('שגיאה ביצירת Canvas'));
                        return;
                    }

                    // חישוב מידות חדשות
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // ציור התמונה
                    ctx.drawImage(img, 0, 0, width, height);

                    // המרה ל-base64
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

                    // חישוב גדלים
                    const originalSize = file.size;
                    const compressedSize = Math.round((compressedBase64.length * 3) / 4);
                    const savingPercent = Math.round(
                        ((originalSize - compressedSize) / originalSize) * 100
                    );

                    resolve({
                        compressedImage: compressedBase64,
                        originalSize,
                        compressedSize,
                        savingPercent
                    });
                } catch (error) {
                    reject(error);
                }
            };

            img.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
    });
};

/**
 * המרת base64 לגודל בקילובייטים
 * @param base64String מחרוזת base64
 * @returns גודל ב-KB
 */
export const getBase64Size = (base64String: string): number => {
    const sizeInBytes = Math.round((base64String.length * 3) / 4);
    return Math.round(sizeInBytes / 1024);
};

/**
 * המרת גודל לפורמט קריא
 * @param bytes גודל בבייטים
 * @returns מחרוזת מפורמטת
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * בדיקת תקינות גודל קובץ
 * @param file הקובץ לבדיקה
 * @param maxSizeMB גודל מקסימלי במגהבייט
 * @returns האם הקובץ תקין
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * בדיקת תקינות סוג קובץ
 * @param file הקובץ לבדיקה
 * @param allowedTypes סוגים מותרים
 * @returns האם הקובץ תקין
 */
export const validateFileType = (
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
): boolean => {
    return allowedTypes.some(type => file.type === type || file.type.startsWith(type.split('/')[0]));
};
