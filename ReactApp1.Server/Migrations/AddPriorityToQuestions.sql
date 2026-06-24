-- הוספת עמודת priority לטבלת Questions
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Questions]') 
    AND name = 'priority'
)
BEGIN
    ALTER TABLE [dbo].[Questions]
    ADD priority INT NOT NULL DEFAULT 0;
    
    PRINT 'Added priority column to Questions table';
END
ELSE
BEGIN
    PRINT 'priority column already exists in Questions table';
END
GO

-- הוספת עמודת priority לטבלת QuestionsForSpace
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[QuestionsForSpace]') 
    AND name = 'priority'
)
BEGIN
    ALTER TABLE [dbo].[QuestionsForSpace]
    ADD priority INT NOT NULL DEFAULT 0;
    
    PRINT 'Added priority column to QuestionsForSpace table';
END
ELSE
BEGIN
    PRINT 'priority column already exists in QuestionsForSpace table';
END
GO

-- הוספת עמודת priority לטבלת Audits
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Audits]') 
    AND name = 'priority'
)
BEGIN
    ALTER TABLE [dbo].[Audits]
    ADD priority INT NOT NULL DEFAULT 0;
    
    PRINT 'Added priority column to Audits table';
END
ELSE
BEGIN
    PRINT 'priority column already exists in Audits table';
END
GO

-- הוספת עמודת priority לטבלת QuestionsForSpaceAudits
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[QuestionsForSpaceAudits]') 
    AND name = 'priority'
)
BEGIN
    ALTER TABLE [dbo].[QuestionsForSpaceAudits]
    ADD priority INT NOT NULL DEFAULT 0;
    
    PRINT 'Added priority column to QuestionsForSpaceAudits table';
END
ELSE
BEGIN
    PRINT 'priority column already exists in QuestionsForSpaceAudits table';
END
GO
