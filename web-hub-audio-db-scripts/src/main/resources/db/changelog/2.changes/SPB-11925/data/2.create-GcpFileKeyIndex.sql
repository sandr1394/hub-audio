IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Segment_GcpFileKey' AND object_id = OBJECT_ID('dbo.Five9Segment')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Segment_GcpFileKey ON [dbo].[Five9Segment]([GcpFileKey])
END
