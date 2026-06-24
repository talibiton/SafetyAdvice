// פונקציה עוזרת להעלאת תמונה לשרת
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/ImageUpload/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url; // מחזיר את ה-URL של התמונה
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const deleteImage = async (fileName: string): Promise<void> => {
    try {
        const response = await fetch(`/api/ImageUpload/delete/${fileName}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};
