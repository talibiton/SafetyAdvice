-- סקריפט להוספת או עדכון משתמש לדוגמה
USE SafetyAdviceDB;
GO

-- עדכון המשתמש הקיים או הוספתו אם לא קיים
IF EXISTS (SELECT * FROM Users WHERE Id = '206883688')
BEGIN
    UPDATE Users 
    SET 
        firstName = N'משתמש',
        lastName = N'בדיקה',
        email = 'test@example.com',
        phone = '050-1234567',
        password = '111'
    WHERE Id = '206883688';
    
    PRINT 'משתמש 206883688 עודכן בהצלחה';
END
ELSE
BEGIN
    INSERT INTO Users (Id, firstName, lastName, email, phone, password)
    VALUES ('206883688', N'משתמש', N'בדיקה', 'test@example.com', '050-1234567', '111');
    
    PRINT 'משתמש 206883688 נוסף בהצלחה';
END
GO

-- הצגת המשתמש
SELECT * FROM Users WHERE Id = '206883688';
GO
