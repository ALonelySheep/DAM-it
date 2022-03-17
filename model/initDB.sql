BEGIN;

CREATE TABLE userAccount(
    id              SERIAL          PRIMARY KEY,
    username        varchar(30)     NOT NULL,
    password	    varchar(50)	    NOT NULL,
    avatar          varchar(100)    ,	
    vip             BOOLEAN		    DEFAULT false,
    admin           BOOLEAN		    DEFAULT false
);

CREATE TABLE app(
    id              SERIAL          PRIMARY KEY,
    name            varchar(30)     NOT NULL,
    price           MONEY           DEFAULT 0,
    monetaryUnit    varchar(10)     DEFAULT 'CNY'       NOT NULL
);

CREATE TABLE subscription(
    id              SERIAL          PRIMARY KEY,
    name            varchar(40)     NOT NULL,
    appId           SERIAL          REFERENCES app(id) ,
    price           MONEY           DEFAULT 0,
    cycle           INTERVAL        DEFAULT '1 month'   NOT NULL,
    monetaryUnit    varchar(10)     DEFAULT 'CNY'       NOT NULL
);

CREATE TABLE paiedContent(
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(40)     NOT NULL,    
    appId           SERIAL          REFERENCES app(id) ,
    price           MONEY           DEFAULT 0,
    monetaryUnit    varchar(10)     DEFAULT 'CNY'       NOT NULL
);

CREATE TABLE installation(
    userId          SERIAL          REFERENCES userAccount(id) ,
    appId           SERIAL          REFERENCES app(id) ,
    ifUninstalled   BOOLEAN         DEFAULT false,
    date            DATE            ,
    category        varchar(20)     
);

CREATE TABLE renewal(
    userId          SERIAL          REFERENCES userAccount(id) ,
    subscriptionId  SERIAL          REFERENCES subscription(id) ,
    startDate       DATE            ,
    numberOfRenewal INTEGER         DEFAULT 0,
    reminder        BOOLEAN         DEFAULT false,
    category        varchar(20)     
);

CREATE TABLE purchase(
    userId          SERIAL          REFERENCES userAccount(id) ,
    paiedContentId  SERIAL          REFERENCES paiedContent(id) ,
    date            DATE            ,
    timeLimit       INTERVAL        DEFAULT NULL, --NULL represents forever
    category        varchar(20)
);

CREATE TABLE device(
    id              SERIAL          PRIMARY KEY,
    userId          SERIAL          REFERENCES userAccount(id) ,
    name            VARCHAR(40)     NOT NULL,
    model           VARCHAR(40)     DEFAULT 'Not Specified',
    storage         INTEGER              
);

CREATE TABLE work(
    id              SERIAL          PRIMARY KEY,
    userId          SERIAL          REFERENCES userAccount(id) ,
    deviceId        SERIAL          REFERENCES device(id) ,
    title           VARCHAR(80)     NOT NULL,
    copyright       VARCHAR(40)     DEFAULT 'Not Specified',
    category        VARCHAR(20)     
);


COMMIT;










