IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'InteractionsCall'
)

BEGIN
CREATE TABLE [dbo].[InteractionsCall]
(
    ID INT IDENTITY(1, 1)
    CONSTRAINT PK_RECORD_ID
    PRIMARY KEY,
    GcpFileKey VARCHAR (50) NULL,
    CallID BIGINT NOT NULL,
    SegmentID VARCHAR(100) NOT NULL,
    ANI BIGINT NULL,
    DNIS BIGINT NULL,
    CallDuration INT NOT NULL,
    IsMigrated BIT NOT NULL,
    DateOfCall datetime NOT NULL,
    CreatedDate datetime NOT NULL
    )
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_InteractionsCall_SegmentID' AND object_id = OBJECT_ID('dbo.InteractionsCall')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_InteractionsCall_SegmentID ON [dbo].[InteractionsCall]([SegmentID])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_InteractionsCall_CallID' AND object_id = OBJECT_ID('dbo.InteractionsCall')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_InteractionsCall_CallID ON [dbo].[InteractionsCall]([CallID])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_InteractionsCall_ANI' AND object_id = OBJECT_ID('dbo.InteractionsCall')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_InteractionsCall_ANI ON [dbo].[InteractionsCall]([ANI])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_InteractionsCall_DNIS' AND object_id = OBJECT_ID('dbo.InteractionsCall')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_InteractionsCall_DNIS ON [dbo].[InteractionsCall]([DNIS])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_InteractionsCall_DateOfCall' AND object_id = OBJECT_ID('dbo.InteractionsCall')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_InteractionsCall_DateOfCall ON [dbo].[InteractionsCall]([DateOfCall])
END
