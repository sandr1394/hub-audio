IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Skill'
)

BEGIN
CREATE TABLE [dbo].[Skill]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Skill_ID PRIMARY KEY,
    SkillName VARCHAR(255) NULL
    )

INSERT INTO Skill (SkillName) VALUES ('UNKNOWN')

END
