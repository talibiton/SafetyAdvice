-- סקריפט להוספת עמודות חסרות לטבלת Users
-- הרץ את הסקריפט הזה ב-SQL Server Management Studio או דרך Visual Studio

USE SafetyAdviceDB;
GO

-- בדיקה אם העמודות כבר קיימות, ואם לא - הוספתן
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'firstName')
BEGIN
    ALTER TABLE Users ADD firstName NVARCHAR(100) NULL;
    PRINT 'עמודה firstName נוספה בהצלחה';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'lastName')
BEGIN
    ALTER TABLE Users ADD lastName NVARCHAR(100) NULL;
    PRINT 'עמודה lastName נוספה בהצלחה';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'email')
BEGIN
    ALTER TABLE Users ADD email NVARCHAR(255) NULL;
    PRINT 'עמודה email נוספה בהצלחה';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'phone')
BEGIN
    ALTER TABLE Users ADD phone NVARCHAR(20) NULL;
    PRINT 'עמודה phone נוספה בהצלחה';
END
GO

PRINT 'כל העמודות עודכנו בהצלחה!';
GO
