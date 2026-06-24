-- Script to drop and recreate Hangfire schema
-- Run this script on your SafetyAdviceDB database

-- Drop all Hangfire tables if they exist (in correct order due to foreign keys)
IF OBJECT_ID('HangFire.JobQueue', 'U') IS NOT NULL DROP TABLE [HangFire].[JobQueue];
IF OBJECT_ID('HangFire.JobParameter', 'U') IS NOT NULL DROP TABLE [HangFire].[JobParameter];
IF OBJECT_ID('HangFire.State', 'U') IS NOT NULL DROP TABLE [HangFire].[State];
IF OBJECT_ID('HangFire.Job', 'U') IS NOT NULL DROP TABLE [HangFire].[Job];
IF OBJECT_ID('HangFire.Set', 'U') IS NOT NULL DROP TABLE [HangFire].[Set];
IF OBJECT_ID('HangFire.List', 'U') IS NOT NULL DROP TABLE [HangFire].[List];
IF OBJECT_ID('HangFire.Hash', 'U') IS NOT NULL DROP TABLE [HangFire].[Hash];
IF OBJECT_ID('HangFire.Counter', 'U') IS NOT NULL DROP TABLE [HangFire].[Counter];
IF OBJECT_ID('HangFire.AggregatedCounter', 'U') IS NOT NULL DROP TABLE [HangFire].[AggregatedCounter];
IF OBJECT_ID('HangFire.Server', 'U') IS NOT NULL DROP TABLE [HangFire].[Server];

-- Drop schema if exists
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'HangFire')
BEGIN
    DROP SCHEMA [HangFire];
END

PRINT 'Hangfire schema cleanup completed. Now restart your application to let Hangfire recreate the schema automatically.';
