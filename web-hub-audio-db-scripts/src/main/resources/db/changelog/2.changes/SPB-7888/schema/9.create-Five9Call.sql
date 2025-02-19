IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Five9Call'
)

BEGIN
CREATE TABLE [dbo].[Five9Call]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Five9Call_ID
    PRIMARY KEY,
    CallID BIGINT NOT NULL
    CONSTRAINT CallID_UNIQUE UNIQUE,
    SessionID VARCHAR(255) NOT NULL
    CONSTRAINT SessionID_UNIQUE UNIQUE,
    ANI BIGINT NULL,
    DNIS BIGINT NULL,
    Abandoned BIT NULL,
    Calls BIT NULL,
    CustomerName VARCHAR(255) NULL,
    DisconnectedFromHold BIT NULL,
    Recordings VARCHAR(2000) NULL,
    SpeedOfAnswerSecs BIGINT NULL,
    CallTimeSecs BIGINT NULL,
    HandleTimeSecs BIGINT NULL,
    HoldTimeSecs BIGINT NULL,
    IVRTimeSecs BIGINT NULL,
    QueueWaitTimeSecs BIGINT NULL,
    ParkTimeSecs BIGINT NULL,
    Holds SMALLINT NULL,
    Transfers SMALLINT NULL,
    Extension SMALLINT NULL,
    FraudFlag BIT NULL,
    IsMigrated BIT NOT NULL,
    CampaignID INT NOT NULL,
    DispositionID INT NOT NULL,
    AgentID INT NOT NULL,
    CallTypeID INT NOT NULL,
    SkillID INT NOT NULL,
    DateOfCall datetime NOT NULL,
    CreatedDate datetime NOT NULL,
    FOREIGN KEY (AgentID) REFERENCES Agent(ID),
    FOREIGN KEY (CampaignID) REFERENCES Campaign(ID),
    FOREIGN KEY (DispositionID) REFERENCES Disposition(ID),
    FOREIGN KEY (CallTypeID) REFERENCES CallType(ID),
    FOREIGN KEY (SkillID) REFERENCES Skill(ID)
    )
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Call_SessionID' AND object_id = OBJECT_ID('dbo.Five9Call')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Call_SessionID ON [dbo].[Five9Call]([SessionID])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Call_CallID' AND object_id = OBJECT_ID('dbo.Five9Call')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Call_CallID ON [dbo].[Five9Call]([CallID])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Call_ANI' AND object_id = OBJECT_ID('dbo.Five9Call')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Call_ANI ON [dbo].[Five9Call]([ANI])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Call_DNIS' AND object_id = OBJECT_ID('dbo.Five9Call')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Call_DNIS ON [dbo].[Five9Call]([DNIS])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Call_DateOfCall' AND object_id = OBJECT_ID('dbo.Five9Call')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Call_DateOfCall ON [dbo].[Five9Call]([DateOfCall])
END
