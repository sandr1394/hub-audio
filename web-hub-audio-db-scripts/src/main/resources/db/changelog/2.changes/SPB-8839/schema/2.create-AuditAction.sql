IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'AuditAction'
)

BEGIN
CREATE TABLE [dbo].[AuditAction]
(
    ID INT IDENTITY(100000, 1)
    CONSTRAINT PK_AuditAction_ID
    PRIMARY KEY,
    ActionName VARCHAR(32) NOT NULL,
    CreatedDate datetimeoffset(3) NOT NULL)
END
