IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE [name] = N'${platform.spring-boot.database.migration.database-name}')
BEGIN
    CREATE DATABASE [${platform.spring-boot.database.migration.database-name}]
END
