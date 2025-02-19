IF (NOT EXISTS(SELECT 1
               FROM sys.views
               WHERE name = 'vFive9CallSegments'))
BEGIN
EXECUTE ('CREATE VIEW vFive9CallSegments
            WITH SCHEMABINDING AS
SELECT F9S.ID,
       FC.CallID,
       FC.SessionID,
       F9S.SegmentID,
       A.ID        AS AgentID,
       A.Email     AS AgentEmail,
       A.FirstName AS AgentFirstName,
       A.LastName  AS AgentLastName,
       C.ID        AS CampaignID,
       C.CampaignName,
       FC.ANI,
       FC.DNIS,
       F9S.CallDuration,
       F9S.GcpFileKey,
       FC.IsMigrated,
       FC.DateOfCall
FROM dbo.Five9Call FC
         JOIN dbo.Five9Segment F9S on FC.CallID = F9S.CallID
         JOIN dbo.Agent A on FC.AgentID = A.ID
         JOIN dbo.Campaign C on FC.CampaignID = C.ID');
END;
