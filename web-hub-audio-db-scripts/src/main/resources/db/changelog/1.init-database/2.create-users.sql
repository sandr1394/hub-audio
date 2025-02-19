USE [${platform.spring-boot.database.migration.master-database-name}]

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE [name] = N'${platform.spring-boot.database.migration.users.manager.username}')
BEGIN
    CREATE LOGIN [${platform.spring-boot.database.migration.users.manager.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.manager.password}',
DEFAULT_DATABASE = [${platform.spring-boot.database.migration.master-database-name}], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF
END
ELSE
BEGIN
    ALTER LOGIN [${platform.spring-boot.database.migration.users.manager.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.manager.password}'
END

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'${platform.spring-boot.database.migration.users.app.username}')
BEGIN
    CREATE LOGIN [${platform.spring-boot.database.migration.users.app.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.app.password}',
DEFAULT_DATABASE = [${platform.spring-boot.database.migration.database-name}], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF
END
ELSE
BEGIN
    ALTER LOGIN [${platform.spring-boot.database.migration.users.app.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.app.password}'
END

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'${platform.spring-boot.database.migration.users.app-ro.username}')
BEGIN
    CREATE LOGIN [${platform.spring-boot.database.migration.users.app-ro.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.app-ro.password}',
DEFAULT_DATABASE = [${platform.spring-boot.database.migration.database-name}], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF
END
ELSE
BEGIN
    ALTER LOGIN [${platform.spring-boot.database.migration.users.app-ro.username}] WITH PASSWORD = N'${platform.spring-boot.database.migration.users.app-ro.password}'
END

USE [${platform.spring-boot.database.migration.database-name}] -- Creates the users for this database

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'${platform.spring-boot.database.migration.users.manager.username}')
BEGIN
    CREATE USER [${platform.spring-boot.database.migration.users.manager.username}] FOR LOGIN [${platform.spring-boot.database.migration.users.manager.username}]
WITH DEFAULT_SCHEMA = [${platform.spring-boot.database.migration.schema-name}]
END
ALTER ROLE [db_ddladmin] ADD MEMBER [${platform.spring-boot.database.migration.users.manager.username}]
ALTER ROLE [db_datareader] ADD MEMBER [${platform.spring-boot.database.migration.users.manager.username}]
ALTER ROLE [db_datawriter] ADD MEMBER [${platform.spring-boot.database.migration.users.manager.username}]

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'${platform.spring-boot.database.migration.users.app.username}')
BEGIN
    CREATE USER [${platform.spring-boot.database.migration.users.app.username}] FOR LOGIN [${platform.spring-boot.database.migration.users.app.username}]
WITH DEFAULT_SCHEMA = [${platform.spring-boot.database.migration.schema-name}]
END
ALTER ROLE [db_datareader] ADD MEMBER [${platform.spring-boot.database.migration.users.app.username}]
ALTER ROLE [db_datawriter] ADD MEMBER [${platform.spring-boot.database.migration.users.app.username}]

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'${platform.spring-boot.database.migration.users.app-ro.username}')
BEGIN
    CREATE USER [${platform.spring-boot.database.migration.users.app-ro.username}] FOR LOGIN [${platform.spring-boot.database.migration.users.app-ro.username}]
WITH DEFAULT_SCHEMA = [${platform.spring-boot.database.migration.schema-name}]
END
ALTER ROLE [db_datareader] ADD MEMBER [${platform.spring-boot.database.migration.users.app-ro.username}]

USE [${platform.spring-boot.database.migration.master-database-name}]
