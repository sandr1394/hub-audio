IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Agent'
)

BEGIN
CREATE TABLE [dbo].[Agent]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Agent_ID
    PRIMARY KEY,
    Email VARCHAR(255) NULL,
    FirstName VARCHAR(255) NULL,
    LastName VARCHAR(255) NULL,
    AgentGroupID INT NOT NULL,
    FOREIGN KEY (AgentGroupID) REFERENCES AgentGroup(ID)
    )

INSERT INTO Agent (Email, FirstName, LastName, AgentGroupID) VALUES ('UNKNOWN', 'UNKNOWN', 'UNKNOWN', 1)
END
