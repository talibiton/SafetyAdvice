-- סקריפט לעדכון משתמש קיים להשתמש בעמודות הנכונות
USE SafetyAdviceDB;
GO

-- עדכון המשתמש הקיים
UPDATE Users 
SET 
    name = N'משתמש בדיקה',  -- זה ישמש בתור firstName
    mail = 'test@example.com',  -- זה ישמש בתור email
    lastName = N'אלול',
    phone = '050-1234567',
    password = '111',
    kind_auth = 1
WHERE Id = '206883688';

PRINT 'משתמש 206883688 עודכן בהצלחה';
GO

-- הצגת המשתמש
SELECT Id, name as firstName, mail as email, lastName, phone, password, kind_auth 
FROM Users 
WHERE Id = '206883688';
GO
