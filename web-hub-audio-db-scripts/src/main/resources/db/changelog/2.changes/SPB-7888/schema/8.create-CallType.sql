IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'CallType'
)

BEGIN
CREATE TABLE [dbo].[CallType]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_CallType_ID PRIMARY KEY,
    CallTypeName VARCHAR(255) NULL
    )

INSERT INTO CallType (CallTypeName) VALUES ('UNKNOWN')

END
