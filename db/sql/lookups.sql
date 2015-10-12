INSERT INTO "ruleset" VALUES(1,'13+5','13-Card Pounce Pile + 5-Point Pounce Bonus',13,5,'2015-09-27 00:39:45',NULL);
INSERT INTO "ruleset" VALUES(2,'10+5','10-Card Pounce Pile + 5-Point Pounce Bonus',10,5,'2015-09-27 15:09:05',NULL);

INSERT INTO "venue" VALUES(1,'tilden','3454 Tilden Ave','2015-09-27 00:38:11',NULL);
INSERT INTO "venue" VALUES(2,'bayliss','Bayliss Road','2015-09-27 15:08:34',NULL);

INSERT INTO "player" VALUES(2,'nee','Neela Hummel','2015-09-26 18:52:51',NULL);
INSERT INTO "player" VALUES(3,'gavin','Gavin Bushnell','2015-09-26 18:53:04','2015-09-26 18:58:18');
INSERT INTO "player" VALUES(4,'dylan','Dylan Bushnell','2015-09-26 18:53:32','2015-09-26 18:58:27');
INSERT INTO "player" VALUES(5,'tom','Tom Hummel','2015-09-26 18:54:49',NULL);
INSERT INTO "player" VALUES(6,'nan','Nancy Bushnell','2015-09-26 18:56:53',NULL);
INSERT INTO "player" VALUES(7,'nol','Nolan Bushnell','2015-09-26 18:57:13',NULL);
INSERT INTO "player" VALUES(8,'fred','Fred Hummel','2015-09-26 18:57:27',NULL);
INSERT INTO "player" VALUES(9,'kate','Kate Hummel','2015-09-26 18:57:42',NULL);

DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('player',9);
INSERT INTO "sqlite_sequence" VALUES('venue',2);
INSERT INTO "sqlite_sequence" VALUES('ruleset',2);
