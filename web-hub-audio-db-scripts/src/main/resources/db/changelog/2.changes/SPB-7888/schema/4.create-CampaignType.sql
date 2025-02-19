IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'CampaignType'
)

BEGIN
CREATE TABLE [dbo].[CampaignType]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_CampaignType_ID
    PRIMARY KEY,
    CampaignTypeName VARCHAR(255) NULL
)

INSERT INTO CampaignType (CampaignTypeName) VALUES ('INBOUND')
INSERT INTO CampaignType (CampaignTypeName) VALUES ('OUTBOUND')

END
