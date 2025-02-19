IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Five9Segment'
)

BEGIN
CREATE TABLE [dbo].[Five9Segment]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Five9Segment_ID
    PRIMARY KEY,
    CallID BIGINT NOT NULL,
    SegmentID INT NOT NULL,
    CallDuration INT NOT NULL,
    GcpFileKey varchar (200) NULL,
    DateOfCall datetime NOT NULL,
    FOREIGN KEY (CallID) REFERENCES Five9Call(CallID)
    )
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Segment_SegmentID' AND object_id = OBJECT_ID('dbo.Five9Segment')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Segment_SegmentID ON [dbo].[Five9Segment]([SegmentID])
END
