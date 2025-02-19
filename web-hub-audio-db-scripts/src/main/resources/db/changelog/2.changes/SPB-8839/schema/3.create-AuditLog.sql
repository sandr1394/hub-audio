IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'AuditLog'
)

BEGIN
CREATE TABLE [dbo].[AuditLog]
(
    ID INT IDENTITY(100000, 1)
    CONSTRAINT PK_AuditLog_ID
    PRIMARY KEY,
    AuditActionID INT NOT NULL,
    VendorID INT NOT NULL,
    AgentUser VARCHAR(32) NOT NULL,
    CallID VARCHAR(20) NULL,
    SegmentID VARCHAR(32) NULL,
    Details VARCHAR(max) NOT NULL,
    CreatedDate datetimeoffset(3) NOT NULL,
    FOREIGN KEY (AuditActionID) REFERENCES AuditAction(ID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(ID))
END
