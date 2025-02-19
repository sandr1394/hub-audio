IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'AgentGroup'
)

BEGIN
CREATE TABLE [dbo].[AgentGroup]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_AgentGroup_ID PRIMARY KEY,
    AgentGroupName VARCHAR(255) NULL
    )

INSERT INTO AgentGroup (AgentGroupName) VALUES ('UNKNOWN')

END
