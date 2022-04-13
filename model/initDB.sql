BEGIN;

CREATE TABLE userAccount(
    id              varchar(30)     PRIMARY KEY,
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
    appId           SERIAL          REFERENCES app(id)  ON DELETE CASCADE,
    price           MONEY           DEFAULT 0,
    monetaryUnit    varchar(10)     DEFAULT 'CNY'       NOT NULL,
    cycle           INTERVAL        DEFAULT '1 month'   NOT NULL,
    UNIQUE (name, appId, price, monetaryUnit, cycle)
);

CREATE TABLE renewal(
    Id              SERIAL          PRIMARY KEY,
    userId          varchar(30)     REFERENCES userAccount(id) ,
    subscriptionId  SERIAL          REFERENCES subscription(id) ON DELETE CASCADE,
    numberOfRenewal INTEGER         DEFAULT 0,
    reminder        BOOLEAN         DEFAULT false,
    category        varchar(20) 	,
    startDate       DATE            NOT NULL,
    autoRenewal     BOOLEAN         DEFAULT true        NOT NULL
);

CREATE TABLE paidContent(
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(40)     NOT NULL,    
    appId           SERIAL          REFERENCES app(id)  ON DELETE CASCADE,
    price           MONEY           DEFAULT 0,
    monetaryUnit    varchar(10)     DEFAULT 'CNY'       NOT NULL
);

CREATE TABLE installation(
    userId          varchar(30)          REFERENCES userAccount(id) ,
    appId           SERIAL          REFERENCES app(id) ON DELETE CASCADE,
    ifUninstalled   BOOLEAN         DEFAULT false,
    date            DATE            DEFAULT now(),
    category        varchar(20) 	     
);

CREATE TABLE purchase(
    userId          varchar(30)    REFERENCES userAccount(id) ,
    paidContentId  SERIAL          REFERENCES paidContent(id) ON DELETE CASCADE,
    date            DATE           DEFAULT now() ,
    timeLimit       INTERVAL       , --NULL represents forever
    category        varchar(20)    
);

CREATE TABLE device(
    id              SERIAL          PRIMARY KEY,
    userId          varchar(30)     REFERENCES userAccount(id) ,
    name            VARCHAR(40)     NOT NULL,
    model           VARCHAR(40)     ,
    storage         INTEGER              
);

CREATE TABLE work(
    id              SERIAL          PRIMARY KEY,
    userId          varchar(30)          REFERENCES userAccount(id) ,
    deviceId        SERIAL          REFERENCES device(id) ,
    name           VARCHAR(80)      NOT NULL,
    copyright       VARCHAR(40)     ,
    category        varchar(20) 	     
);

-- 输入subscription的信息, 返回对应的Subscription的id, 如果不存在则自动创建
CREATE OR REPLACE FUNCTION getSubId(varchar(40),integer,money,varchar(10),interval) RETURNS TABLE (SubId integer) AS
$func$ 
BEGIN
    RETURN QUERY SELECT id FROM subscription WHERE name = $1 AND appId = $2 AND price = $3 AND monetaryUnit = $4 AND cycle = $5;
    IF NOT FOUND THEN
        RETURN QUERY 
            INSERT INTO subscription (name,appId,price,monetaryUnit,cycle) 
            VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING id;
    END IF;
END
$func$
LANGUAGE plpgsql;

COMMIT;










