IF EXISTS( SELECT 1
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_NAME = 'Five9Segment'
  AND COLUMN_NAME = 'SegmentID'
  and DATA_TYPE='int')
BEGIN
    IF EXISTS(SELECT 1 FROM sys.views where name='vFive9CallSegments')
    BEGIN
    DROP VIEW vFive9CallSegments;
    END

    IF EXISTS (select 1
               FROM sys.indexes
               WHERE name='IX_Five9Segment_SegmentID' AND object_id = OBJECT_ID('dbo.Five9Segment'))
    BEGIN
    DROP INDEX Five9Segment.IX_Five9Segment_SegmentID;
    END

    ALTER TABLE Five9Segment
    ALTER
    COLUMN SegmentID BIGINT NOT NULL

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'IX_Five9Segment_SegmentID' AND object_id = OBJECT_ID('dbo.Five9Segment')
    )
    BEGIN
      CREATE NONCLUSTERED INDEX IX_Five9Segment_SegmentID ON [dbo].[Five9Segment]([SegmentID])
    END

END



