-- Add kind_Authvut column to Users table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'kind_Authvut')
BEGIN
    ALTER TABLE Users 
    ADD kind_Authvut INT NULL;
    
    -- Set default value for existing users
    UPDATE Users 
    SET kind_Authvut = 0 
    WHERE kind_Authvut IS NULL;
    
    PRINT 'Column kind_Authvut added successfully';
END
ELSE
BEGIN
    PRINT 'Column kind_Authvut already exists';
END
