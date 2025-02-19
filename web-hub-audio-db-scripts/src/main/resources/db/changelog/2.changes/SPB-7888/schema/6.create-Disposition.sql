IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Disposition'
)

BEGIN
CREATE TABLE [dbo].[Disposition]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Disposition_ID
    PRIMARY KEY,
    DispositionName VARCHAR(255) NULL
)

INSERT INTO Disposition (DispositionName) VALUES ('UNKNOWN')

END
