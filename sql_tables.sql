-- Tables that need to be created to successfully run your own instance of Flibber

CREATE TABLE "user" (
	id 					bigserial PRIMARY KEY NOT NULL,
	name 				text NOT NULL,
	onlineState 		text NOT NULL DEFAULT 'offline',
	email 				text NOT NULL
);

CREATE TABLE contact (
	id 					bigserial PRIMARY KEY NOT NULL,
	user1				bigint REFERENCES "user"(id) NOT NULL ON DELETE CASCADE,
	user2				bigint REFERENCES "user"(id) NOT NULL on DELETE CASCADE
);

CREATE TABLE contact_request (
	id 					bigserial PRIMARY KEY NOT NULL,
	requestee			bigint REFERENCES "user"(id) NOT NULL ON DELETE CASCADE,
	requester			bigint REFERENCES "user"(id) NOT NULL ON DELETE CASCADE
);

CREATE TABLE chat (
	id 					bigserial PRIMARY KEY NOT NULL,
	created_at 			timestamp NOT NULL DEFAULT now(),
	from 				bigint NOT NULL,
	to 					bigint NOT NULL,
	message 			json NOT NULL,
	conversation_id 	bigint NOT NULL
);
