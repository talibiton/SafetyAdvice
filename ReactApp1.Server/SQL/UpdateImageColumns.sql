-- סקריפט לעדכון עמודות התמונה בטבלאות Audits ו-QuestionsForSpaceAudits
-- יש להריץ את הסקריפט הזה במסד הנתונים SafetyAdviceDB

USE SafetyAdviceDB
GO

-- בדיקה ושינוי עמודת img בטבלת Audits
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Audits]') AND name = 'img')
BEGIN
    ALTER TABLE [dbo].[Audits]
    ALTER COLUMN [img] NVARCHAR(MAX) NULL
    
    PRINT 'עמודת img בטבלת Audits עודכנה בהצלחה'
END
ELSE
BEGIN
    PRINT 'עמודת img בטבלת Audits לא נמצאה'
END
GO

-- בדיקה ושינוי עמודת img בטבלת QuestionsForSpaceAudits  
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[QuestionsForSpaceAudits]') AND name = 'img')
BEGIN
    ALTER TABLE [dbo].[QuestionsForSpaceAudits]
    ALTER COLUMN [img] NVARCHAR(MAX) NULL
    
    PRINT 'עמודת img בטבלת QuestionsForSpaceAudits עודכנה בהצלחה'
END
ELSE
BEGIN
    PRINT 'עמודת img בטבלת QuestionsForSpaceAudits לא נמצאה'
END
GO

PRINT 'עדכון הטבלאות הושלם בהצלחה!'
GO
