IF
NOT EXISTS (
  SELECT 1
	FROM sys.tables t
	JOIN sys.schemas s ON t.schema_id = s.schema_id
	WHERE s.name = 'dbo' AND t.name = 'Campaign'
)

BEGIN
CREATE TABLE [dbo].[Campaign]
(
    ID INT IDENTITY (1, 1)
    CONSTRAINT PK_Campaign_ID
    PRIMARY KEY,
    CampaignName VARCHAR(255) NULL,
    CampaignTypeID INT NOT NULL,
    FOREIGN KEY (CampaignTypeID) REFERENCES CampaignType(ID)
)

INSERT INTO Campaign (CampaignName, CampaignTypeID) VALUES ('UNKNOWN', 1)

END
