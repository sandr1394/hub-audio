IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Five9Segment_CallID' AND object_id = OBJECT_ID('dbo.Five9Segment')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Five9Segment_CallID ON [dbo].[Five9Segment]([CallID])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Vendor_VendorName' AND object_id = OBJECT_ID('dbo.Vendor')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_Vendor_VendorName ON [dbo].[Vendor]([VendorName])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_AuditAction_ActionName' AND object_id = OBJECT_ID('dbo.AuditAction')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_AuditAction_ActionName ON [dbo].[AuditAction]([ActionName])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_AuditLog_AgentUser' AND object_id = OBJECT_ID('dbo.AuditLog')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_AuditLog_AgentUser ON [dbo].[AuditLog]([AgentUser])
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_AuditLog_SegmentID' AND object_id = OBJECT_ID('dbo.AuditLog')
)
BEGIN
  CREATE NONCLUSTERED INDEX IX_AuditLog_SegmentID ON [dbo].[AuditLog]([SegmentID])
END
